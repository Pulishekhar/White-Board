from pydantic import BaseModel
from typing import List, Optional

class Drawing(BaseModel):
    room_id: str
    strokes: List[dict]  # List of drawing strokes
    timestamp: Optional[str] = None
