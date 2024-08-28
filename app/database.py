from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from setting import DBAuth

# PostgreSQL 연결 URL 설정 (환경 변수로 설정)

dbAuth = DBAuth()

POSTGRES_USER = dbAuth.get_user()
POSTGRES_PASSWORD = dbAuth.get_password()
POSTGRES_DB = dbAuth.get_db()
POSTGRES_HOST = dbAuth.get_host()

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
