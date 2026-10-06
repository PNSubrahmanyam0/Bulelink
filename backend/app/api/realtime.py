from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import json
from sqlalchemy.orm import Session
from .core.database import get_db
from ..models import Message, User
from ..services.realtime import manager
import uuid

router = APIRouter(prefix="/ws", tags=["realtime"])

@router.websocket("/chat/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, db: Session = Depends(get_db)):
    # Note: In a real app, we would authenticate the WebSocket connection
    # using a token in the query string.
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            receiver_id = message_data.get("receiver_id")
            content = message_data.get("content")

            # 1. Persist message
            new_msg = Message(
                sender_id=user_id,
                receiver_id=receiver_id,
                content=content
            )
            db.add(new_msg)
            db.commit()

            # 2. Send to receiver if online
            await manager.send_personal_message({
                "sender_id": user_id,
                "content": content,
                "message_id": str(new_msg.id)
            }, receiver_id)

    except WebSocketDisconnect:
        manager.disconnect(user_id)
