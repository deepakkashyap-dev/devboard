from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Literal["pending", "completed"] = "pending"
    priority: Literal["low", "medium", "high"] = "medium"
    dueDate: datetime

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[Literal["pending", "completed"]] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    dueDate: Optional[datetime] = None