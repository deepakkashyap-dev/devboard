from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from dotenv import load_dotenv

load_dotenv()

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None

async def connect_db():
    global client, database
    mongodb_url = os.getenv("MONGODB_URL")
    if not mongodb_url:
        raise ValueError("MONGODB_URL environment variable is not set")
    client = AsyncIOMotorClient(mongodb_url)
    database = client[os.getenv("DB_NAME", "devboard")]
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)
        raise
    

async def close_db():
    global client
    if client:
        client.close()

def get_db() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("DB not initialized")
    return database