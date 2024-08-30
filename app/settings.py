from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    POSTGRESQL_USERNAME: str
    POSTGRESQL_PASSWORD: str
    POSTGRESQL_DBNAME: str
    POSTGRESQL_SERVER: str
    POSTGRESQL_PORT: str
    ADMINPAGE_PASSWORD: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
