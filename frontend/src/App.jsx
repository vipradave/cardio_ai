import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ImageUploadScreen from "./screens/ImageUploadScreen";
import AnalysisResultScreen from "./screens/AnalysisResultScreen";
import DoctorReviewDashboard from "./screens/DoctorReviewDashboard";
import VerificationScreen from "./screens/VerificationScreen";
import MedicalReportScreen from "./screens/MedicalReportScreen";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <main className="flex-1 w-full max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<ImageUploadScreen />} />
            <Route path="/analysis/:id" element={<AnalysisResultScreen />} />
            <Route path="/review/:id" element={<DoctorReviewDashboard />} />
            <Route path="/verify/:id" element={<VerificationScreen />} />
            <Route path="/report/:id" element={<MedicalReportScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="py-6 text-center text-sm text-slate-400 border-t border-slate-100 bg-white no-print">
          &copy; {new Date().getFullYear()} AI-Driven CAD Management System.
          Research Use Only.
        </footer>
      </div>
    </Router>
  );
}

export default App;
