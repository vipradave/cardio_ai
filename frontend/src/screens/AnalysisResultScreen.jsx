import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Activity,
    AlertTriangle,
    CheckCircle,
    Share2,
    Download,
    Calendar,
    FileText,
    ArrowRight
} from 'lucide-react';

const AnalysisResultScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    // Fallback if accessed directly without state
    const resultData = state?.analysisResult;
    const imageUrl = state?.imageUrl;
    const imageName = state?.imageName || "Uploaded Image";
    const timestamp = new Date().toLocaleString();

    if (!resultData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="p-6 rounded-full bg-[rgba(255,255,255,0.05)] mb-4">
                    <AlertTriangle className="w-12 h-12 text-[var(--color-warning)]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Analysis Data Found</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    We couldn't retrieve the analysis results. Please verify the ID or upload a new image.
                </p>
                <button onClick={() => navigate('/')} className="btn btn-secondary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Upload
                </button>
            </div>
        );
    }

    // Handle display of result data
    const displayResult = typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2);

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Breadcrumb */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Upload
                    </button>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                        Analysis Results
                    </h2>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary text-sm py-2">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </button>
                    <button className="btn btn-primary text-sm py-2">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Image & Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image Card */}
                    <div className="card p-1 overflow-hidden">
                        <div className="bg-black rounded-xl overflow-hidden relative min-h-[400px] flex items-center justify-center">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Angiogram Analysis"
                                    className="w-full h-auto object-contain max-h-[600px]"
                                />
                            ) : (
                                <div className="text-[var(--color-text-secondary)] flex flex-col items-center">
                                    <FileText className="w-12 h-12 mb-2 opacity-50" />
                                    <span>No image preview available</span>
                                </div>
                            )}

                            {/* Overlay Badge */}
                            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] text-xs font-mono">
                                ID: {id}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Findings */}
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="card">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--glass-border)]">
                            <Activity className="w-6 h-6 text-[var(--color-accent)]" />
                            <h3 className="text-xl font-bold">AI Findings</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Detection Result Box */}
                            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
                                <span className="text-sm text-[var(--color-text-secondary)] block mb-1">
                                    Prediction Output
                                </span>
                                <div className="text-lg font-mono text-[var(--color-text-primary)] break-all whitespace-pre-wrap">
                                    {displayResult}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                                    <div className="flex items-center gap-2 mb-1 text-[var(--color-text-secondary)]">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-xs">Analyzed On</span>
                                    </div>
                                    <div className="text-sm font-medium">{timestamp}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                                    <div className="flex items-center gap-2 mb-1 text-[var(--color-text-secondary)]">
                                        <FileText className="w-3 h-3" />
                                        <span className="text-xs">Source File</span>
                                    </div>
                                    <div className="text-sm font-medium truncate" title={imageName}>{imageName}</div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link to={`/review/${id}`} className="btn btn-secondary w-full justify-between group">
                                    <span>Proceed to Doctor Review</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-[rgba(16,185,129,0.05)] border-[rgba(16,185,129,0.2)]">
                        <div className="flex gap-4">
                            <CheckCircle className="w-6 h-6 text-[var(--color-success)] flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-sm mb-1 text-[var(--color-success)]">Analysis Complete</h4>
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    The model has successfully processed the imagery. Please verify all findings clinically.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalysisResultScreen;
