from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["whiteboard_db"]
collection = db["boards"]

async def get_board_data(room_id: str):
    return await collection.find_one({"room_id": room_id})
