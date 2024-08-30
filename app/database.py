from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .settings import settings

# PostgreSQL 연결 URL 설정 (환경 변수로 설정)

POSTGRES_USER = settings.POSTGRESQL_USERNAME
POSTGRES_PASSWORD = settings.POSTGRESQL_PASSWORD
POSTGRES_DB = settings.POSTGRESQL_DBNAME
POSTGRES_HOST = settings.POSTGRESQL_SERVER

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
