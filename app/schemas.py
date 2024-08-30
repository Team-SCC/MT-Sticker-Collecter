from pydantic import BaseModel


class TeamBase(BaseModel):
    name: str


class TeamCreate(TeamBase):
    pass


class Team(TeamBase):
    id: int
    stickers: int

    class Config:
        from_attributes = True


class UpdateSticker(BaseModel):
    stickers: int


class BasicResponse(BaseModel):
    detail: str


class TeamCreateResponse(BasicResponse):
    name: str


class UpdateStickerResponse(BasicResponse):
    name: str
    sticker: int


class UpdateStickerRequest(TeamBase):
    stickers: int


class TeamDeleteResponse(BasicResponse):
    team_name: str
