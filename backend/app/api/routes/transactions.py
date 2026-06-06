"""지출 내역 CRUD / 검색 라우터 (골격)."""
from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_transactions(q: str | None = None, category: str | None = None):
    # TODO: 검색/필터 조회
    raise NotImplementedError


@router.post("")
def create_transaction():
    # TODO: 지출 내역 수동 작성 (cid/bid 결제유형 포함)
    raise NotImplementedError


@router.put("/{tx_id}")
def update_transaction(tx_id: str):
    # TODO: 내역 수정
    raise NotImplementedError


@router.delete("/{tx_id}")
def delete_transaction(tx_id: str):
    # TODO: 내역 삭제
    raise NotImplementedError
