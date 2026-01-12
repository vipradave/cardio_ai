import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Check, X, Edit2, ArrowRight, Save, Loader } from 'lucide-react';

const DoctorReviewDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [showOverlay, setShowOverlay] = useState(true);
    const [decision, setDecision] = useState(null); // 'accept', 'modify', 'reject'
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    // Get data from location state or fallback
    const result = location.state?.result || {
        stenosisPercentage: 75,
        severity: "Unknown",
        confidence: 0,
        bbox: { x: 0, y: 0, w: 0, h: 0 }
    };
    const imageUrl = location.state?.imageUrl; // Defaults will be handled in render

    const handleDecision = (type) => {
        setDecision(type);
    };

    const handleSaveAndVerify = async () => {
        setSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Navigate to Verification
            // For now, passing data via state
            navigate(`/verify/${id || 'new'}`, {
                state: {
                    review: {
                        decision,
                        notes,
                        finalSeverity: decision === 'accept' ? result.severity : 'Modified'
                    },
                    imageUrl
                }
            });
        } catch (err) {
            console.error(err);
            alert('Failed to save review. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
            {/* Left: Interactive Image Viewer */}
            <div className="flex-1 card p-1 flex flex-col gap-4">
                <div className="flex justify-between items-center px-4 pt-2">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">Angiogram Viewer</span>
                    <button
                        onClick={() => setShowOverlay(!showOverlay)}
                        className="btn btn-secondary text-xs py-1 px-3"
                    >
                        {showOverlay ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                        {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
                    </button>
                </div>

                <div className="flex-1 relative bg-black rounded-lg min-h-[500px] flex items-center justify-center overflow-hidden mx-1 mb-1">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Angiography Review"
                            className="max-h-[600px] max-w-full object-contain"
                        />
                    ) : (
                        <div className="text-[var(--color-text-secondary)]">No Image Loaded</div>
                    )}

                    {showOverlay && result.bbox && result.bbox.w > 0 && (
                        <div
                            className="absolute border-2 border-[var(--color-danger)] shadow-[0_0_15px_rgba(239,68,68,0.5)] bg-[rgba(239,68,68,0.1)]"
                            style={{
                                left: `${result.bbox.x * 100}%`,
                                top: `${result.bbox.y * 100}%`,
                                width: `${result.bbox.w * 100}%`,
                                height: `${result.bbox.h * 100}%`,
                            }}
                        >
                            <span className="absolute -top-7 left-0 bg-[var(--color-danger)] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                {result.stenosisPercentage}% Stenosis
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Decision Panel */}
            <div className="w-full lg:w-[400px] flex flex-col gap-6">
                <div className="card space-y-6">
                    <div className="border-b border-[var(--glass-border)] pb-4">
                        <h2 className="text-2xl font-bold">Doctor Review</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-xs font-mono bg-[rgba(255,255,255,0.1)]">
                                ID: {id || 'NEW-CASE'}
                            </span>
                            <span className="text-xs text-[var(--color-text-secondary)]">Pending Verification</span>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[var(--glass-border)]">
                        <span className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">AI Assessment</span>
                        <div className="flex justify-between items-center mt-2">
                            <span className="font-medium">Findings</span>
                            <span className={`font-bold ${result.severity === 'Severe' ? 'text-[var(--color-danger)]' :
                                    result.severity === 'Moderate' ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'
                                }`}>
                                {result.severity} ({result.stenosisPercentage}%)
                            </span>
                        </div>
                    </div>

                    {/* Decision Buttons */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">Clinical Decision</p>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleDecision('accept')}
                                className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left group
                            ${decision === 'accept'
                                        ? 'bg-[rgba(16,185,129,0.1)] border-[var(--color-success)]'
                                        : 'border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)]'}
                        `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${decision === 'accept' ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white' : 'border-[var(--color-text-secondary)] text-[var(--color-text-secondary)]'}`}>
                                    <Check size={16} />
                                </div>
                                <div>
                                    <span className={`block font-bold ${decision === 'accept' ? 'text-[var(--color-success)]' : ''}`}>Accept</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">Confirm AI findings</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleDecision('modify')}
                                className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left group
                            ${decision === 'modify'
                                        ? 'bg-[rgba(245,158,11,0.1)] border-[var(--color-warning)]'
                                        : 'border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)]'}
                        `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${decision === 'modify' ? 'border-[var(--color-warning)] bg-[var(--color-warning)] text-white' : 'border-[var(--color-text-secondary)] text-[var(--color-text-secondary)]'}`}>
                                    <Edit2 size={16} />
                                </div>
                                <div>
                                    <span className={`block font-bold ${decision === 'modify' ? 'text-[var(--color-warning)]' : ''}`}>Modify</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">Adjust severity/region</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleDecision('reject')}
                                className={`p-4 rounded-xl border flex items-center gap-4 transition-all text-left group
                            ${decision === 'reject'
                                        ? 'bg-[rgba(239,68,68,0.1)] border-[var(--color-danger)]'
                                        : 'border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)]'}
                        `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${decision === 'reject' ? 'border-[var(--color-danger)] bg-[var(--color-danger)] text-white' : 'border-[var(--color-text-secondary)] text-[var(--color-text-secondary)]'}`}>
                                    <X size={16} />
                                </div>
                                <div>
                                    <span className={`block font-bold ${decision === 'reject' ? 'text-[var(--color-danger)]' : ''}`}>Reject</span>
                                    <span className="text-xs text-[var(--color-text-secondary)]">False positive</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Clinical Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add detailed observations..."
                            className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl p-4 min-h-[100px] text-sm focus:outline-none focus:border-[var(--color-accent)] focus:bg-[rgba(0,0,0,0.3)] transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSaveAndVerify}
                        disabled={!decision || saving}
                        className={`btn btn-primary w-full text-lg h-12 shadow-lg ${(!decision || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {saving ? <Loader className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                        <span>{saving ? 'Saving Review...' : 'Submit & Verify'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorReviewDashboard;
