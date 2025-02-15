from database import db
from models import Drawing

async def save_drawing(drawing: Drawing):
    collection = db["drawings"]
    await collection.insert_one(drawing.dict())

async def get_drawing(room_id: str):
    collection = db["drawings"]
    return await collection.find_one({"room_id": room_id})
