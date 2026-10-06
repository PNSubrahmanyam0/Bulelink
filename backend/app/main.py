from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, profiles, videos, feed, realtime
from .core.database import Base, engine

# Create database tables on startup (Simple for MVP, use Alembic for production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BlueLink API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(videos.router)
app.include_router(feed.router)
app.include_router(realtime.router)

@app.get("/")
def root():
    return {"message": "Welcome to BlueLink API", "status": "healthy"}
