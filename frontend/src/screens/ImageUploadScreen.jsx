import { useState, useEffect } from 'react';
import { Upload, X, AlertCircle, Loader2, CheckCircle2, Shield, Lock, Zap } from 'lucide-react';

const ImageUploadScreen = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setError(null);
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
            setError("Please upload a valid image file (JPEG, PNG).");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError("File size exceeds 5MB limit.");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Analysis complete! (Demo mode)');
        } catch (err) {
            setError("Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Main Card Container */}
            <div className="w-full max-w-2xl relative z-10">

                {/* Glass morphism card - Forced Background */}
                <div
                    className="rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >

                    {/* Gradient accent bar with animation */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                    </div>

                    <div className="p-10 md:p-12">

                        {/* Header with icon */}
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-4 shadow-lg shadow-blue-500/30">
                                <Upload className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                Medical Image Analysis
                            </h1>
                            <p className="text-gray-600 text-base max-w-md mx-auto">
                                Upload your medical scan or diagnostic image for instant AI-powered analysis
                            </p>
                        </div>

                        {/* Upload Area */}
                        {!file ? (
                            <div
                                className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-500 ease-out overflow-hidden
                ${dragActive
                                        ? "border-cyan-400 bg-cyan-50 scale-[1.01] shadow-lg shadow-cyan-500/20"
                                        : "border-gray-300 bg-gray-50 hover:border-cyan-300 hover:shadow-md"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                {/* Animated gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                                        <div className="relative bg-white p-5 rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                            <Upload className={`w-10 h-10 transition-colors duration-300 ${dragActive ? 'text-cyan-600' : 'text-gray-400 group-hover:text-cyan-500'}`} />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <p className="text-gray-800 font-semibold text-xl">
                                            Drop your image here
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            or <span className="text-cyan-600 font-medium">browse files</span>
                                        </p>
                                        <p className="text-gray-400 text-xs pt-2">
                                            Supports: JPG, PNG, GIF • Maximum size: 5MB
                                        </p>
                                    </div>
                                </div>

                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    style={{ display: 'none' }}
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                            </div>
                        ) : (
                            // Image Preview with enhanced design
                            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                                {/* File info with glass effect */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm">
                                    <div className="flex items-end justify-between">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                <span className="text-white font-semibold truncate">{file.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-white/70">
                                                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                <span>•</span>
                                                <span className="text-emerald-400">Ready for analysis</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Close button with better styling */}
                                <button
                                    onClick={clearFile}
                                    className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white transition-all duration-200 hover:scale-110 hover:rotate-90"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-5 flex items-start gap-3 p-4 text-red-700 bg-red-50 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="mt-8">
                            <button
                                onClick={handleSubmit}
                                disabled={!file || loading}
                                className={`w-full relative flex items-center justify-center py-5 rounded-xl font-semibold text-white text-lg transition-all duration-300 overflow-hidden group
                ${!file || loading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98]'
                                    }`}
                            >
                                {!file || loading ? null : (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                )}

                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                        Analyzing Image...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 mr-2" />
                                        Analyze Image
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Security badges */}
                        <div className="mt-8 flex items-center justify-center gap-6 text-gray-500">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="p-1.5 bg-emerald-100 rounded-lg">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span>HIPAA Compliant</span>
                            </div>

                            <div className="h-4 w-px bg-gray-300"></div>

                            <div className="flex items-center gap-2 text-sm">
                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                </div>
                                <span>256-bit Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer text */}
                <div className="mt-6 text-center">
                    <p className="text-white/60 text-sm">
                        © 2026 AI-Driven CAD Management System • For Research Use Only
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
        </div>
    );
};

export default ImageUploadScreen;