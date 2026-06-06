"""Pydantic 스키마 (골격)."""
from datetime import date
from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class TransactionBase(BaseModel):
    store: str            # 가게명
    amount: int           # 금액
    spent_at: date        # 날짜
    category: str | None = None
    # 결제 유형 구분 (제안서 3.4): 카드 결제 / 현금 결제
    cid: str | None = None   # card id (카드 결제)
    bid: str | None = None   # bill id (현금 결제)


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: str
    user_id: str

    # TODO: 필드 보강 (생성일시 등)
