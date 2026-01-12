import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Check,
  X,
  Edit2,
  ArrowRight,
  Save,
  Loader,
  AlertCircle,
  FileText,
  ChevronRight,
} from "lucide-react";

const DoctorReviewDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(true);
  const [showAnnotated, setShowAnnotated] = useState(false); // toggle between original / annotated view
  const [decision, setDecision] = useState(null); // 'accept', 'modify', 'reject'
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Get data from location state or fallback
  const result = location.state?.result || {
    stenosisPercentage: 75,
    severity: "Unknown",
    confidence: 0,
    bbox: { x: 0, y: 0, w: 0, h: 0 },
  };
  const imageUrl = location.state?.imageUrl || null;
  const annotatedImageDataUrl = location.state?.annotatedImageDataUrl || null;

  // Decide which image to display
  const displayImageUrl =
    showAnnotated && annotatedImageDataUrl ? annotatedImageDataUrl : imageUrl;

  const handleDecision = (type) => {
    setDecision(type);
  };

  const handleSaveAndVerify = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate(`/verify/${id || "new"}`, {
        state: {
          review: {
            decision,
            notes,
            finalSeverity: decision === "accept" ? result.severity : "Modified",
          },
          imageUrl: displayImageUrl || imageUrl,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 anime-enter">
      {/* Left: Interactive Image Viewer */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center text-sm breadcrumbs text-slate-500 mb-2">
          <span>Analysis</span>
          <ChevronRight size={14} />
          <span className="font-semibold text-sky-600">Review</span>
        </div>

        <div className="card-premium flex flex-col overflow-hidden bg-white">
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <FileText size={16} className="text-slate-500" />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Angiogram Visualization
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle annotated/original if annotated image available */}
              {annotatedImageDataUrl && (
                <div className="flex items-center gap-2 mr-2">
                  <button
                    onClick={() => {
                      setShowAnnotated(false);
                    }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      !showAnnotated
                        ? "bg-sky-100 text-sky-700 border border-sky-200"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    Original
                  </button>
                  <button
                    onClick={() => {
                      setShowAnnotated(true);
                    }}
                    className={`px-3 py-1 rounded-md text-sm ${
                      showAnnotated
                        ? "bg-sky-100 text-sky-700 border border-sky-200"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    Annotated
                  </button>
                </div>
              )}

              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all flex items-center shadow-sm
                                ${
                                  showOverlay
                                    ? "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
              >
                {showOverlay ? (
                  <EyeOff size={14} className="mr-2" />
                ) : (
                  <Eye size={14} className="mr-2" />
                )}
                {showOverlay ? "Hide Findings" : "Show Findings"}
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-50 min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Grid overlay for professional feel */}
            <div className="absolute inset-0 opacity-8 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt="Angiography Review"
                className="max-h-[600px] max-w-full object-contain relative z-10"
              />
            ) : (
              <div className="text-slate-500 flex flex-col items-center">
                <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                <span>No Image Loaded</span>
              </div>
            )}

            {showOverlay && result.bbox && result.bbox.w > 0 && (
              <div
                className="absolute border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)] bg-rose-500/10 z-20 backdrop-blur-[1px]"
                style={{
                  left: `${result.bbox.x * 100}%`,
                  top: `${result.bbox.y * 100}%`,
                  width: `${result.bbox.w * 100}%`,
                  height: `${result.bbox.h * 100}%`,
                }}
              >
                <span className="absolute -top-8 left-0 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md flex items-center gap-1">
                  <AlertCircle size={12} />
                  {result.stenosisPercentage}% Stenosis
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Decision Panel */}
      <div className="w-full lg:w-[420px] flex flex-col gap-6 pt-8">
        <div className="card-premium p-6 space-y-6 lg:sticky lg:top-6">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Clinical Review
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                ID: {id || "NEW"}
              </span>
              <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="text-xs font-medium text-slate-500">
                Action Required
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>

            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
              AI Assessment
            </span>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm font-medium text-slate-500 block mb-1">
                  Detected Severity
                </span>
                <span
                  className={`text-2xl font-bold ${
                    result.severity === "Severe"
                      ? "text-rose-600"
                      : result.severity === "Moderate"
                        ? "text-amber-500"
                        : "text-emerald-600"
                  }`}
                >
                  {result.severity}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-slate-500 block mb-1">
                  Stenosis
                </span>
                <span className="text-xl font-bold text-slate-700">
                  {result.stenosisPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Edit2 size={14} />
              Your Decision
            </p>
            <div className="grid grid-cols-1 gap-3">
              {/* Accept */}
              <button
                onClick={() => handleDecision("accept")}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 group relative overflow-hidden
                                ${
                                  decision === "accept"
                                    ? "bg-emerald-50 border-emerald-500 shadow-md"
                                    : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-sm"
                                }
                                `}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${decision === "accept" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-100 bg-slate-50 text-slate-300 group-hover:border-emerald-200 group-hover:text-emerald-400"}`}
                >
                  <Check size={20} strokeWidth={3} />
                </div>
                <div className="relative z-10">
                  <span
                    className={`block font-bold text-base ${decision === "accept" ? "text-emerald-800" : "text-slate-700"}`}
                  >
                    Accept Findings
                  </span>
                  <span
                    className={`text-xs ${decision === "accept" ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    Confirm AI diagnosis is correct
                  </span>
                </div>
              </button>

              {/* Modify */}
              <button
                onClick={() => handleDecision("modify")}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 group
                                ${
                                  decision === "modify"
                                    ? "bg-amber-50 border-amber-500 shadow-md"
                                    : "bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm"
                                }
                                `}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${decision === "modify" ? "border-amber-500 bg-amber-500 text-white" : "border-slate-100 bg-slate-50 text-slate-300 group-hover:border-amber-200 group-hover:text-amber-400"}`}
                >
                  <Edit2 size={20} strokeWidth={3} />
                </div>
                <div>
                  <span
                    className={`block font-bold text-base ${decision === "modify" ? "text-amber-800" : "text-slate-700"}`}
                  >
                    Modify Assessment
                  </span>
                  <span
                    className={`text-xs ${decision === "modify" ? "text-amber-600" : "text-slate-400"}`}
                  >
                    Adjust severity or details
                  </span>
                </div>
              </button>

              {/* Reject */}
              <button
                onClick={() => handleDecision("reject")}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 group
                                ${
                                  decision === "reject"
                                    ? "bg-rose-50 border-rose-500 shadow-md"
                                    : "bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 hover:shadow-sm"
                                }
                                `}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${decision === "reject" ? "border-rose-500 bg-rose-500 text-white" : "border-slate-100 bg-slate-50 text-slate-300 group-hover:border-rose-200 group-hover:text-rose-400"}`}
                >
                  <X size={20} strokeWidth={3} />
                </div>
                <div>
                  <span
                    className={`block font-bold text-base ${decision === "reject" ? "text-rose-800" : "text-slate-700"}`}
                  >
                    Reject Findings
                  </span>
                  <span
                    className={`text-xs ${decision === "reject" ? "text-rose-600" : "text-slate-400"}`}
                  >
                    Mark as false positive/error
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Notes Section - Animated expansion could be nice here, keeping it simple for now */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-bold text-slate-700">
              Clinical Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add detailed clinical observations here..."
              className="input-premium min-h-[100px] resize-none text-sm"
            />
          </div>

          <button
            onClick={handleSaveAndVerify}
            disabled={!decision || saving}
            className={`btn-premium-primary w-full h-14 text-lg shadow-lg shadow-sky-900/10 ${!decision || saving ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
          >
            {saving ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            <span>{saving ? "Processing Review..." : "Submit & Verify"}</span>
            {!saving && <ArrowRight size={18} className="opacity-80" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorReviewDashboard;
