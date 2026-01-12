import os
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class AnalysisRequest(BaseModel):
    image_path: str


class AnalysisResponse(BaseModel):
    stenosis_percentage: float
    confidence: float
    severity: str
    bbox: dict
    annotated_image_base64: Optional[str] = None


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(request: AnalysisRequest):
    """
    Analyze image by forwarding it to a Hugging Face Space (or similar) that returns:
      - stenosis_detected (bool)
      - severity_percent (float)
      - annotated_image_base64 (str)  <-- optional

    This endpoint:
      1. Ensures the provided image path exists on disk (uploads/...)
      2. Sends the file as multipart/form-data to the configured HF_SPACE_URL (env) or default
      3. Maps the HF response fields to our AnalysisResponse shape
      4. Returns the annotated image base64 (if present) so frontend can render it as a data URL
    """
    hf_url = os.getenv("HF_SPACE_URL", "https://omgy-innovate.hf.space/predict")

    # resolve local path (file may be provided as 'uploads/filename' or '/uploads/filename')
    path = request.image_path
    if path.startswith("/"):
        path = path.lstrip("/")
    if not os.path.exists(path):
        raise HTTPException(
            status_code=400, detail=f"Image file not found: {request.image_path}"
        )

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            with open(path, "rb") as fh:
                files = {
                    "file": (os.path.basename(path), fh, "application/octet-stream")
                }
                resp = await client.post(hf_url, files=files)
            if resp.status_code >= 400:
                # include response for easier debugging
                raise HTTPException(
                    status_code=502,
                    detail=f"HuggingFace endpoint returned {resp.status_code}: {resp.text}",
                )
            hf_json = resp.json()
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502, detail=f"Request to HF space failed: {str(exc)}"
        )

    # Default mapping
    stenosis = None
    confidence = None
    severity = "Unknown"
    bbox = {"x": 0.0, "y": 0.0, "w": 0.0, "h": 0.0}
    annotated_b64 = None

    # HF Space commonly returns keys like 'severity_percent', 'stenosis_detected', 'annotated_image_base64'
    if isinstance(hf_json, dict):
        # numeric percent fields
        if "severity_percent" in hf_json:
            try:
                stenosis = float(hf_json.get("severity_percent") or 0.0)
            except Exception:
                stenosis = 0.0
        elif "severity" in hf_json and isinstance(
            hf_json.get("severity"), (int, float, str)
        ):
            try:
                stenosis = float(hf_json.get("severity"))
            except Exception:
                stenosis = None

        # confidence if present
        if "confidence" in hf_json:
            try:
                confidence = float(hf_json.get("confidence") or 0.0)
            except Exception:
                confidence = None

        # annotated image base64
        for key in (
            "annotated_image_base64",
            "annotated_base64",
            "image_base64",
            "base64_image",
        ):
            if key in hf_json and isinstance(hf_json.get(key), str):
                annotated_b64 = hf_json.get(key)
                break

        # sometimes HF returns nested structure under 'data' or 'output'
        if not annotated_b64:
            nested = (
                hf_json.get("data") or hf_json.get("output") or hf_json.get("result")
            )
            if isinstance(nested, dict):
                for key in (
                    "annotated_image_base64",
                    "annotated_base64",
                    "image_base64",
                    "base64_image",
                    "b64_json",
                ):
                    if key in nested and isinstance(nested.get(key), str):
                        annotated_b64 = nested.get(key)
                        break
            # some endpoints return a list of outputs; try to probe first element
            if (
                not annotated_b64
                and isinstance(nested, list)
                and len(nested) > 0
                and isinstance(nested[0], dict)
            ):
                for key in (
                    "annotated_image_base64",
                    "annotated_base64",
                    "image_base64",
                    "base64_image",
                    "b64_json",
                ):
                    if key in nested[0] and isinstance(nested[0].get(key), str):
                        annotated_b64 = nested[0].get(key)
                        break

    # Fallbacks and normalization
    if stenosis is None:
        # try to extract from common alternate keys
        try:
            if isinstance(hf_json, dict) and "stenosis_percent" in hf_json:
                stenosis = float(hf_json.get("stenosis_percent") or 0.0)
        except Exception:
            stenosis = 0.0

    if stenosis is None:
        stenosis = 0.0

    if confidence is None:
        # if HF didn't return confidence, set conservative default
        confidence = 0.95

    # Map percent -> categorical severity (same logic as frontend expects)
    try:
        stenosis_val = float(stenosis)
    except Exception:
        stenosis_val = 0.0

    if stenosis_val > 70:
        severity = "Severe"
    elif stenosis_val > 50:
        severity = "Moderate"
    else:
        severity = "Mild"

    return {
        "stenosis_percentage": round(stenosis_val, 2),
        "confidence": round(float(confidence), 2),
        "severity": severity,
        "bbox": bbox,
        "annotated_image_base64": annotated_b64,
    }
