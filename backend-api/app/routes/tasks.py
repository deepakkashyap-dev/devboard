from fastapi import APIRouter, HTTPException, Query
from app.models import TaskCreate, TaskUpdate
from app.database import get_db
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional

router = APIRouter()

def serialize(task: dict) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description"),
        "status": task["status"],
        "priority": task["priority"],
        "dueDate": task["dueDate"],
        "createdAt": task["createdAt"],
        "isDeleted": task.get("isDeleted", False),
    }

def get_oid(task_id: str) -> ObjectId:
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID")
    return ObjectId(task_id)


# /stats MUST come before /{task_id} 
@router.get("/stats")
async def get_stats():
    db = get_db()
    now = datetime.now(timezone.utc)

    pipeline = [
        {"$match": {"isDeleted": False}},
        {"$group": {
            "_id": None,
            "total": {"$sum": 1},
            "completed": {"$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}},
            "pending":   {"$sum": {"$cond": [{"$eq": ["$status", "pending"]}, 1, 0]}},
            "overdue":   {"$sum": {"$cond": [
                {"$and": [{"$eq": ["$status", "pending"]}, {"$lt": ["$dueDate", now]}]},
                1, 0
            ]}}
        }}
    ]

    result = await db.tasks.aggregate(pipeline).to_list(1)
    if not result:
        return {"total": 0, "completed": 0, "pending": 0, "overdue": 0}

    r = result[0]
    return {"total": r["total"], "completed": r["completed"],
            "pending": r["pending"], "overdue": r["overdue"]}


@router.get("/")
async def get_tasks(status: Optional[str] = Query(None, pattern="^(pending|completed)$")):
    db = get_db()
    query: dict = {"isDeleted": False}
    if status:
        query["status"] = status
    tasks = await db.tasks.find(query).sort("createdAt", -1).to_list(500)
    return [serialize(t) for t in tasks]


@router.post("/", status_code=201)
async def create_task(task: TaskCreate):
    db = get_db()
    data = task.model_dump()
    data["createdAt"] = datetime.now(timezone.utc)
    data["isDeleted"] = False
    result = await db.tasks.insert_one(data)
    created = await db.tasks.find_one({"_id": result.inserted_id})
    return serialize(created)


@router.put("/{task_id}")
async def update_task(task_id: str, task: TaskUpdate):
    db = get_db()
    oid = get_oid(task_id)
    fields = {k: v for k, v in task.model_dump().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.tasks.update_one(
        {"_id": oid, "isDeleted": False}, {"$set": fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return serialize(await db.tasks.find_one({"_id": oid}))


@router.patch("/{task_id}/status")
async def toggle_status(task_id: str):
    db = get_db()
    oid = get_oid(task_id)
    task = await db.tasks.find_one({"_id": oid, "isDeleted": False})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    new_status = "completed" if task["status"] == "pending" else "pending"
    await db.tasks.update_one({"_id": oid}, {"$set": {"status": new_status}})
    return serialize(await db.tasks.find_one({"_id": oid}))


@router.delete("/{task_id}")
async def delete_task(task_id: str):
    db = get_db()
    oid = get_oid(task_id)
    # Soft delete — isDeleted: make it true 
    result = await db.tasks.update_one(
        {"_id": oid, "isDeleted": False}, {"$set": {"isDeleted": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted", "id": task_id}