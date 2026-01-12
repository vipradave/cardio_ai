from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel

router = APIRouter()

class ReviewCreate(BaseModel):
    case_id: str
    image_path: str
    ai_prediction_stenosis: float
    ai_confidence: float
    doctor_notes: str
    doctor_decision: str
    final_stenosis_severity: str

@router.post("/reviews")
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = models.DoctorReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/reviews/{case_id}")
def read_review(case_id: str, db: Session = Depends(get_db)):
    review = db.query(models.DoctorReview).filter(models.DoctorReview.case_id == case_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review
