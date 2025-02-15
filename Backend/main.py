from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager
from pymongo import MongoClient
import socketio
from typing import Dict, List
from fastapi.responses import JSONResponse

app = FastAPI()

# Enable CORS (for frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Socket.IO
sio = socketio.AsyncServer(cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["whiteboard_db"]
boards_collection = db["boards"]

@app.get("/")
async def home():
    return {"message": "Welcome to the Real-time Whiteboard API!"}

# Event: Client joins a board (room)
@sio.event
async def join(sid, data):
    room_id = data.get("room_id")
    if not room_id:
        return

    print(f"Client {sid} joined room {room_id}")
    await sio.enter_room(sid, room_id)

    # Send existing board data
    board = boards_collection.find_one({"room_id": room_id})
    if board:
        await sio.emit("load_board", board.get("data", []), room=sid)

# Event: When a client updates the board
@sio.event
async def update_board(sid, data):
    room_id = data.get("room_id")
    board_data = data.get("board_data", [])

    if not room_id:
        return

    try:
        # Save board data in MongoDB
        boards_collection.update_one(
            {"room_id": room_id}, {"$set": {"data": board_data}}, upsert=True
        )

        # Broadcast update to all clients in the room
        await sio.emit("board_updated", board_data, room=room_id)
    except Exception as e:
        print(f"Error updating board: {e}")

# Event: Client disconnects
@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

@app.get("/board/{room_id}")
async def get_board(room_id: str):
    try:
        board = boards_collection.find_one({"room_id": room_id})
        return JSONResponse(content=board["data"] if board else [])
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/board/save")
async def save_board(room_id: str, data: List[Dict]):
    try:
        boards_collection.update_one(
            {"room_id": room_id}, {"$set": {"data": data}}, upsert=True
        )
        return {"message": "Board saved!"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.delete("/board/{room_id}")
async def clear_board(room_id: str):
    try:
        boards_collection.delete_one({"room_id": room_id})
        return {"message": "Board cleared!"}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Use ASGI app for running FastAPI with WebSockets
import uvicorn

if __name__ == "__main__":
    uvicorn.run(socket_app, host="0.0.0.0", port=5000, reload=True)
