from sqlalchemy.orm import Session
from .models import Team
from .schemas import TeamCreate, UpdateStickerResponse, UpdateStickerRequest


def insert_team(db: Session, team: TeamCreate) -> Team | None:
    db_team = Team(name=team.name)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    return db_team


def get_team(db: Session, team_name: str) -> Team:
    return db.query(Team).filter(Team.name == team_name).first()


def get_teams(db: Session, skip: int = 0, limit: int = 100) -> list[Team]:
    return db.query(Team).offset(skip).limit(limit).all()


def update_team_sticker(
    db: Session, update_team: UpdateStickerRequest
) -> UpdateStickerResponse:
    db_team = get_team(db, update_team.name)

    if db_team:
        db_team.stickers += update_team.stickers
        db.commit()
        db.refresh(db_team)

    return db_team

def delete_team(db: Session, team_name: str) -> int:
    result = db.query(Team).filter(Team.name == team_name).delete()
    db.commit()

    return result
