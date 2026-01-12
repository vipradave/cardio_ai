import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  Share2,
  Download,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";

const AnalysisResultScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Fallback if accessed directly without state
  const resultData = state?.analysisResult;
  const imageUrl = state?.imageUrl;
  const imageName = state?.imageName || "Uploaded Image";
  const timestamp = new Date().toLocaleString();

  // Prefer annotated image (base64 returned by backend / HF) when available.
  // The backend may return the annotated image either as a dedicated field in the analysis result
  // (e.g. annotated_image_base64) or the frontend may have placed it in state.annotatedImageDataUrl.
  const annotatedB64 =
    state?.annotatedImageDataUrl ||
    resultData?.annotated_image_base64 ||
    resultData?.annotated_base64 ||
    resultData?.image_base64 ||
    resultData?.base64_image ||
    null;

  // Build a safe data URL if we received a raw base64 string (no data: prefix).
  let mainImageUrl = imageUrl || null;
  if (
    annotatedB64 &&
    typeof annotatedB64 === "string" &&
    annotatedB64.length > 20
  ) {
    // If annotatedB64 already includes data: prefix, use it as-is. Otherwise assume PNG.
    mainImageUrl = annotatedB64.startsWith("data:")
      ? annotatedB64
      : `data:image/png;base64,${annotatedB64}`;
  }

  if (!resultData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-6 rounded-full bg-yellow-50 mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-800">
          No Analysis Data Found
        </h2>
        <p className="text-slate-500 mb-6">
          We couldn't retrieve the analysis results. Please verify the ID or
          upload a new image.
        </p>
        <button onClick={() => navigate("/")} className="btn btn-outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Upload
        </button>
      </div>
    );
  }

  // Handle display of result data
  // Remove large base64 fields from the JSON shown on-screen to avoid dumping binary data into the UI.
  let displayResult;
  if (typeof resultData === "string") {
    displayResult = resultData;
  } else {
    try {
      const sanitized = { ...resultData };
      // Remove any known base64 fields before stringifying
      delete sanitized.annotated_image_base64;
      delete sanitized.annotated_base64;
      delete sanitized.image_base64;
      delete sanitized.base64_image;
      delete sanitized.b64_json;
      displayResult = JSON.stringify(sanitized, null, 2);
    } catch (e) {
      displayResult = JSON.stringify(resultData, null, 2);
    }
  }

  return (
    <div className="max-w-6xl mx-auto anime-fade-in">
      {/* Header / Breadcrumb */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </button>
          <h2 className="text-3xl font-bold text-slate-900">
            Analysis Results
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline text-sm py-2">
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
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 relative min-h-[500px] flex items-center justify-center">
            {mainImageUrl ? (
              <div className="w-full flex items-center justify-center relative">
                <img
                  src={mainImageUrl}
                  alt="Angiogram Analysis"
                  className="w-full h-auto object-contain max-h-[600px]"
                />
                {annotatedB64 && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-mono border border-white/20">
                    Annotated
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <span>No image preview available</span>
              </div>
            )}

            {/* Overlay Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-mono border border-white/20">
              ID: {id}
            </div>
          </div>
        </div>

        {/* Right Column: AI Findings */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="card-clean p-6 bg-white">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Activity className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-800">AI Findings</h3>
            </div>

            <div className="space-y-6">
              {/* Detection Result Box */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Prediction Output
                </span>
                <div className="text-sm font-mono text-slate-800 break-all whitespace-pre-wrap">
                  {displayResult}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Analyzed On</span>
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {timestamp}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 text-slate-500">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-xs">Source File</span>
                  </div>
                  <div
                    className="text-sm font-medium text-slate-900 truncate"
                    title={imageName}
                  >
                    {imageName}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to={`/review/${id}`}
                  className="btn btn-outline w-full justify-between group hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                >
                  <span>Proceed to Doctor Review</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          <div className="card-clean p-4 bg-emerald-50 border-emerald-100">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm mb-1 text-emerald-800">
                  Analysis Complete
                </h4>
                <p className="text-xs text-emerald-700">
                  The model has successfully processed the imagery. Please
                  verify all findings clinically.
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
