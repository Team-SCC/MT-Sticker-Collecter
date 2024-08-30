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
from .settings import settings

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
    new_team = TeamCreate(name=team_name)
    result = insert_team(db=db, team=new_team)

    if result is None:
        return TeamCreateResponse(detail="fail", name="생성 실패")
    return TeamCreateResponse(detail="success", name=result.name)


@app.put("/update_sticker", response_model=UpdateStickerResponse)
async def update_sticker(
    update_team: UpdateStickerRequest, db: Session = Depends(get_db)
) -> UpdateStickerResponse:
    result = update_team_sticker(db, update_team)

    response = UpdateStickerResponse(
        detail="success", name=result.name, sticker=result.stickers
    )

    return response


@app.get("/load_teams_rank")
async def load_rank(db: Session = Depends(get_db)) -> list[Team]:
    result = get_teams(db)

    sorted_result = sorted(result, key=lambda team: team.stickers, reverse=True)

    return sorted_result


@app.get("/leader_board")
async def leaderboard_page(db: Session = Depends(get_db)):
    return templates.TemplateResponse("leaderboard.html", {"request": {}})


@app.get("/leader_board_admin/{password}")
async def admin_page(password: str, db: Session = Depends(get_db)):
    if password == settings.ADMINPAGE_PASSWORD:
        return templates.TemplateResponse("admin.html", {"request": {}})
    return templates.TemplateResponse("leaderboard.html", {"request": {}})


@app.delete("/delete_team/{team_name}", response_model=TeamDeleteResponse)
async def delete_api(
    team_name: str, db: Session = Depends(get_db)
) -> TeamDeleteResponse:
    result = delete_team(db, team_name)

    if result:
        return TeamDeleteResponse(detail="success", team_name=team_name)
    else:
        return TeamDeleteResponse(detail="fail", team_name=team_name)


if __name__ == "__main__":
    import subprocess

    command = ["gunicorn", "--reload", "--workers", "4", "app.main:app"]

    subprocess.run(command)
