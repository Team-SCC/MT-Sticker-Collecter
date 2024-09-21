from sqlalchemy.orm import Session
from .models import Team
from .schemas import TeamCreate, UpdateStickerResponse, UpdateStickerRequest


async def insert_team(db: Session, team: TeamCreate) -> Team | None:
    db_team = Team(name=team.name)  # 팀 생성
    db.add(db_team)                 # 데이터베이스에 팀 추가
    db.commit()                     # 데이터베이스 적용
    db.refresh(db_team)             # 데이터베이스 갱신

    return db_team


async def get_team(db: Session, team_name: str) -> Team:
    return db.query(Team).filter(Team.name == team_name).first()    # 이름이 같은 팀을 조회


async def get_teams(db: Session, skip: int = 0, limit: int = 100) -> list[Team]:
    return db.query(Team).offset(skip).limit(limit).all()   # 팀 목록 전체 조회


async def update_team_sticker(
    db: Session, update_team: UpdateStickerRequest
) -> UpdateStickerResponse:
    db_team = await get_team(db, update_team.name)  # 팀 조회

    if db_team: # 팀이 존재하면
        db_team.stickers += update_team.stickers    # 해당 팀의 스티커 추가
        db.commit()                                 # 데이터베이스 적용
        db.refresh(db_team)                         # 데이터베이스 갱신

    return db_team


async def delete_team(db: Session, team_name: str) -> int:
    result = db.query(Team).filter(Team.name == team_name).delete() # 팀 삭제
    db.commit()                                                     # 데이터베이스 적용

    return result
