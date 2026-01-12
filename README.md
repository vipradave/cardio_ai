# AI-Driven CAD Management System

A full-stack application for automated analysis of X-ray coronary angiography images, featuring a doctor-in-the-loop verification process.

## 🏗️ Architecture
- **Backend**: FastAPI (Python) - Handles image processing, AI inference (YOLOv8), and database operations.
- **Frontend**: React + Vite - Premium UI for doctors to review and verify analysis.
- **Database**: SQLite - Stores clinical reviews and case history.

## 🚀 How to Run

### Prerequisites
- Python 3.8+
- Node.js & npm

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

### 3. Usage Flow
1. **Upload**: Drag & drop an angiography image on the home screen.
2. **Analyze**: The system will detect stenosis (Mocked for now).
3. **Review**: Doctor accepts, modifies, or rejects findings.
4. **Verify**: Doctor signs off the case.
5. **Report**: Generate and print the medical report.

## 📁 Project Structure
- `backend/api/`: API route handlers.
- `backend/models.py`: Database models.
- `frontend/src/screens/`: React components for each page.
- `frontend/src/index.css`: Global styles (Premium aesthetics).
