from fastapi import FastAPI, Depends
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import engine, get_db
from .schemas import (
    TeamCreate,
    TeamCreateResponse,
    UpdateStickerResponse,
    BasicResponse,
    Team,
    TeamDeleteResponse,
)
from .crud import insert_team, update_team_sticker, get_teams, delete_team
from .schemas import UpdateStickerRequest
from .models import Base

app = FastAPI()

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 템플릿 디렉토리 설정
templates = Jinja2Templates(directory="app/templates")

# 정적 파일 제공 (CSS, JS 등)
app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/", response_model=BasicResponse)
async def default_page() -> BasicResponse:
    return BasicResponse(detail="success")


@app.post("/create_team/{team_name}", response_model=TeamCreateResponse)
async def create_team(
    team_name: str, db: Session = Depends(get_db)
) -> TeamCreateResponse:
    pass


@app.put("/update_sticker", response_model=UpdateStickerResponse)
async def update_sticker(
    update_team: UpdateStickerRequest, db: Session = Depends(get_db)
) -> UpdateStickerResponse:
    pass


@app.get("/load_teams_rank")
async def load_rank(db: Session = Depends(get_db)) -> list[Team]:
    pass


@app.get("/leader_board")
async def leaderboard_page(db: Session = Depends(get_db)):
    pass


@app.get("/leader_board_admin")
async def admin_page(db: Session = Depends(get_db)):
    pass


@app.delete("/delete_team/{team_name}", response_model=TeamDeleteResponse)
async def delete_api(
    team_name: str, db: Session = Depends(get_db)
) -> TeamDeleteResponse:
    pass