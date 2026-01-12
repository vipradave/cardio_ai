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
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 min-h-[70vh] flex flex-col justify-center">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(16,185,129,0.1)] mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-8 h-8 text-[var(--color-success)]" />
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-green-400">
                    Final Verification
                </h2>
                <p className="text-[var(--color-text-secondary)] text-lg">
                    Confirm diagnosis and sign off to generate medical report.
                </p>
            </div>

            <div className="card space-y-8 p-8 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-success)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--glass-border)] pb-2">
                            Case Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <span className="text-[var(--color-text-secondary)]">Case ID</span>
                            <span className="font-mono text-right font-medium">{id}</span>

                            <span className="text-[var(--color-text-secondary)]">Assessment</span>
                            <span className={`font-bold text-right ${severity === 'Severe' ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'
                                }`}>
                                {severity} ({percentage}%)
                            </span>

                            <span className="text-[var(--color-text-secondary)]">Clinical Decision</span>
                            <span className="text-[var(--color-success)] font-bold text-right capitalize flex items-center justify-end gap-1">
                                <Check size={14} /> {decision}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4 border-b border-[var(--glass-border)] pb-2">
                            Digital Signature
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[var(--color-text-secondary)] mb-1.5 block">Doctor's Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                                    <input
                                        type="text"
                                        value={doctorName}
                                        onChange={(e) => setDoctorName(e.target.value)}
                                        placeholder="e.g. Dr. Sarah Smith"
                                        className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[var(--color-accent)] focus:bg-[rgba(0,0,0,0.3)] transition-all disabled:opacity-50"
                                        disabled={signed}
                                    />
                                </div>
                            </div>

                            {!signed ? (
                                <button
                                    onClick={handleSign}
                                    disabled={doctorName.length < 3}
                                    className={`btn btn-primary w-full h-12 text-lg shadow-lg ${doctorName.length < 3 ? 'opacity-50' : 'hover:scale-[1.02]'}`}
                                >
                                    Sign & Finalize
                                </button>
                            ) : (
                                <div className="text-center p-4 bg-[rgba(16,185,129,0.1)] rounded-xl border border-[rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-[var(--color-success)] font-bold flex items-center justify-center gap-2">
                                        <ShieldCheck size={18} />
                                        Signed by {doctorName}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 opacity-80">
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
                    className="btn btn-primary w-full max-w-sm mx-auto h-14 text-lg space-x-2 animate-in fade-in slide-in-from-bottom-4 shadow-[0_0_30px_rgba(14,165,233,0.3)]"
                >
                    <FileText size={24} />
                    <span>Generate Medical Report</span>
                </button>
            )}
        </div>
    );
};

export default VerificationScreen;
