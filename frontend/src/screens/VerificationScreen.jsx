import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, Check, User } from 'lucide-react';

const VerificationScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [signed, setSigned] = useState(false);
    const [doctorName, setDoctorName] = useState('');

    const reviewData = location.state?.review || {};
    // Ensure we handle nested or flat structure depending on what passed
    const severity = reviewData.finalSeverity || reviewData.final_stenosis_severity || "Severe";
    const percentage = reviewData.ai_prediction_stenosis || 75;
    const decision = reviewData.decision || reviewData.doctor_decision || "Accepted";

    const handleSign = () => {
        if (doctorName.length > 3) setSigned(true);
    };

    const handleGenerateReport = () => {
        navigate(`/report/${id}`);
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 anime-fade-in min-h-[70vh] flex flex-col justify-center">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4 border border-emerald-100">
                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">
                    Final Verification
                </h2>
                <p className="text-slate-500 text-lg">
                    Confirm diagnosis and sign off to generate medical report.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">
                <div className="space-y-6 relative z-10">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                            Case Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <span className="text-slate-500">Case ID</span>
                            <span className="font-mono text-right font-medium text-slate-700">{id}</span>

                            <span className="text-slate-500">Assessment</span>
                            <span className={`font-bold text-right ${severity === 'Severe' ? 'text-red-600' : 'text-amber-500'
                                }`}>
                                {severity} ({percentage}%)
                            </span>

                            <span className="text-slate-500">Clinical Decision</span>
                            <span className="text-emerald-700 font-bold text-right capitalize flex items-center justify-end gap-1">
                                <Check size={14} /> {decision}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                            Digital Signature
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Doctor's Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        placeholder="e.g. Dr. Sarah Smith"
                                        className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-50"
                                        disabled={signed}
                                    />
                                </div>
                            </div>

                            {!signed ? (
                                <button
                                    onClick={handleSign}
                                    disabled={doctorName.length < 3}
                                    className={`btn btn-primary w-full h-12 text-lg shadow-sm ${doctorName.length < 3 ? 'opacity-50' : 'hover:shadow-md'}`}
                                >
                                    Sign & Finalize
                                </button>
                            ) : (
                                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-emerald-700 font-bold flex items-center justify-center gap-2">
                                        <ShieldCheck size={18} />
                                        Signed by {doctorName}
                                    </p>
                                    <p className="text-xs text-emerald-600/70 mt-1">
                                        {new Date().toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {signed && (
                <button
                    onClick={handleGenerateReport}
                    className="btn btn-primary w-full max-w-sm mx-auto h-14 text-lg space-x-2 animate-in fade-in slide-in-from-bottom-4 shadow-lg hover:shadow-xl"
                >
                    <FileText size={24} />
                    <span>Generate Medical Report</span>
                </button>
            )}
        </div>
    );
};

export default VerificationScreen;
