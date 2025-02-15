from pydantic import BaseModel
from typing import List

class Stroke(BaseModel):
    x: float
    y: float
    color: str
    size: int

class BoardUpdate(BaseModel):
    room_id: str
    strokes: List[Stroke]
