

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ImageUploadScreen from './screens/ImageUploadScreen';
import AnalysisResultScreen from './screens/AnalysisResultScreen';
import DoctorReviewDashboard from './screens/DoctorReviewDashboard';
import VerificationScreen from './screens/VerificationScreen';
import MedicalReportScreen from './screens/MedicalReportScreen';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar Removed as requested */}

        <main className="flex-1 container py-8 fade-in flex flex-col justify-center">
          <Routes>
            <Route path="/" element={<ImageUploadScreen />} />
            <Route path="/analysis/:id" element={<AnalysisResultScreen />} />
            <Route path="/review/:id" element={<DoctorReviewDashboard />} />
            <Route path="/verify/:id" element={<VerificationScreen />} />
            <Route path="/report/:id" element={<MedicalReportScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="py-6 text-center text-sm text-[var(--color-text-secondary)]" style={{ borderTop: '1px solid var(--glass-border)' }}>
          &copy; {new Date().getFullYear()} AI-Driven CAD Management System. For Research Use Only.
        </footer>
      </div>
    </Router>
  );
}

export default App;
