from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from database import Base
import datetime

class DoctorReview(Base):
    __tablename__ = "doctor_reviews"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, index=True)
    image_path = Column(String)
    ai_prediction_stenosis = Column(Float)
    ai_confidence = Column(Float)
    doctor_notes = Column(Text)
    doctor_decision = Column(String) # "Accept", "Modify", "Reject"
    final_stenosis_severity = Column(String)
    review_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
