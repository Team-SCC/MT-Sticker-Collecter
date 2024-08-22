from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .crud import insert_team, update_team_sticker
from .database import engine, get_db
from .schemas import (
    TeamCreate,
    TeamCreateResponse,
    UpdateStickerResponse,
)
from .schemas import UpdateStickerRequest
from .models import Base

app = FastAPI()

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)


@app.post("/create_team", response_model=TeamCreateResponse)
async def create_team(
    team: TeamCreate, db: Session = Depends(get_db)
) -> TeamCreateResponse:
    result = insert_team(db=db, team=team)

    response = TeamCreateResponse(detail="success", name=result.name)

    return response


@app.post("/update_sticker", response_model=UpdateStickerResponse)
async def update_sticker(
    update_team: UpdateStickerRequest, db: Session = Depends(get_db)
) -> UpdateStickerResponse:
    result = update_team_sticker(db, update_team)

    response = UpdateStickerResponse(
        detail="success", name=result.name, sticker=result.stickers
    )

    return response
