from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
import time

router = APIRouter()

class AnalysisRequest(BaseModel):
    image_path: str

class AnalysisResponse(BaseModel):
    stenosis_percentage: float
    confidence: float
    severity: str
    bbox: dict

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(request: AnalysisRequest):
    # TODO: Load real YOLOv8 model and run inference
    # model = YOLO('path/to/best.pt')
    # results = model(request.image_path)
    
    # Mock Inference
    time.sleep(2) # Simulate processing time
    
    stenosis = random.uniform(40, 95)
    severity = "Severe" if stenosis > 70 else "Moderate" if stenosis > 50 else "Mild"
    
    return {
        "stenosis_percentage": round(stenosis, 2),
        "confidence": round(random.uniform(0.85, 0.99), 2),
        "severity": severity,
        "bbox": {"x": 0.4, "y": 0.3, "w": 0.2, "h": 0.2} 
    }
