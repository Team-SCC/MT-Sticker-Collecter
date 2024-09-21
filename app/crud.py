from sqlalchemy.orm import Session
from .models import Team
from .schemas import TeamCreate, UpdateStickerResponse, UpdateStickerRequest


async def insert_team(db: Session, team: TeamCreate) -> Team | None:
    pass


async def get_team(db: Session, team_name: str) -> Team:
    pass


async def get_teams(db: Session, skip: int = 0, limit: int = 100) -> list[Team]:
    pass


async def update_team_sticker(
    db: Session, update_team: UpdateStickerRequest
) -> UpdateStickerResponse:
    pass


async def delete_team(db: Session, team_name: str) -> int:
    pass
