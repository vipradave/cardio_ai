import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Lock,
  FileText,
  Zap,
} from "lucide-react";

const ImageUploadScreen = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    setDragActive(false);
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
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

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      // 1) Upload the image file to backend /upload
      const formData = new FormData();
      formData.append("file", file, file.name);

      const uploadResp = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResp.ok) {
        const text = await uploadResp.text().catch(() => null);
        throw new Error(text || "Upload failed");
      }

      const uploadJson = await uploadResp.json();
      const filename = uploadJson.filename;
      const imagePath = uploadJson.path; // server-side path
      const imageUrl = `${BACKEND_URL}/uploads/${encodeURIComponent(filename)}`;

      // 2) Call analyze endpoint with the server path
      const analyzeResp = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_path: imagePath }),
      });

      if (!analyzeResp.ok) {
        const text = await analyzeResp.text().catch(() => null);
        throw new Error(text || "Analysis failed");
      }

      const analysisResult = await analyzeResp.json();

      // 2a) If analysisResult includes an annotated image as base64 or a URL that returns base64,
      // convert it to a data URL so downstream screens can display it directly.
      let annotatedDataUrl = null;

      // Case 1: base64 included directly in response
      if (
        analysisResult.annotated_base64 &&
        typeof analysisResult.annotated_base64 === "string"
      ) {
        const raw = analysisResult.annotated_base64.trim();
        annotatedDataUrl = raw.startsWith("data:")
          ? raw
          : `data:image/png;base64,${raw}`;
      }

      // Case 2: a URL is provided which returns base64 text/JSON (e.g., huggingface raw endpoint)
      if (
        !annotatedDataUrl &&
        (analysisResult.annotated_url || analysisResult.annotated_hf_url)
      ) {
        const url =
          analysisResult.annotated_url || analysisResult.annotated_hf_url;
        try {
          const hfResp = await fetch(url);
          if (hfResp.ok) {
            const ct = hfResp.headers.get("content-type") || "";
            let b64text = null;

            if (ct.includes("application/json")) {
              // Some HF endpoints return JSON with a base64 field (e.g. {"b64_json": "..."})
              const json = await hfResp.json();
              // commonly used keys
              b64text =
                json.b64_json ||
                json.base64 ||
                json.image ||
                json.data ||
                // fallback: pick first string value
                Object.values(json).find((v) => typeof v === "string");
            } else {
              // raw base64 in response body
              b64text = await hfResp.text();
            }

            if (typeof b64text === "string" && b64text.trim().length > 0) {
              const raw = b64text.trim();
              annotatedDataUrl = raw.startsWith("data:")
                ? raw
                : `data:image/png;base64,${raw}`;
            }
          }
        } catch (hfErr) {
          // don't fail whole flow for annotated image fetch; just log
          console.warn("Failed to fetch annotated image URL:", hfErr);
        }
      }

      // 3) Navigate to the analysis screen and pass result via state
      // include annotatedDataUrl when available so downstream screens (doctor review) can use it
      navigate(`/analysis/${encodeURIComponent(filename)}`, {
        state: {
          analysisResult,
          imageUrl,
          imageName: filename,
          annotatedImageDataUrl: annotatedDataUrl, // may be null if none available
        },
      });
    } catch (error) {
      console.error(error);
      setError(error?.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full px-4 py-12 anime-enter bg-gradient-to-r from-sky-50 to-white">
      {/* Hero header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-100 to-white border border-sky-100 text-sky-700 text-sm font-semibold tracking-wide shadow-sm mb-4">
          <Zap size={14} />
          AI-POWERED DIAGNOSTICS
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          Medical Image Analysis
        </h1>

        <p className="text-slate-600 max-w-2xl mx-auto">
          Upload coronary angiography images for instant, secure, and accurate
          stenosis detection using our advanced computer vision model.
        </p>
      </div>

      {/* Center card */}
      <div className="max-w-4xl mx-auto relative">
        <div className="rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden p-8 md:p-10 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left decorative column */}
            <div className="hidden md:block md:col-span-2">
              <div className="h-full w-full rounded-lg bg-gradient-to-b from-sky-50 to-white border border-sky-50"></div>
            </div>

            {/* Main upload column */}
            <div className="col-span-1 md:col-span-8">
              <div className="flex flex-col gap-6">
                {/* Dropzone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload").click()}
                  className={`cursor-pointer rounded-xl transition-all duration-200 border-2 ${
                    dragActive
                      ? "border-sky-400 bg-sky-50/60 scale-[1.01]"
                      : "border-dashed border-sky-200 bg-gradient-to-b from-white to-sky-50/50 hover:shadow-inner"
                  } p-8 flex flex-col items-center justify-center text-center min-h-[200px]`}
                >
                  {!file ? (
                    <>
                      <Upload className="w-12 h-12 text-sky-500 mb-4" />
                      <h3 className="text-xl font-semibold text-slate-800">
                        Drop image here
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        or{" "}
                        <span className="text-sky-600 underline font-medium">
                          browse files
                        </span>{" "}
                        to upload
                      </p>
                      <p className="text-xs text-slate-400 mt-3">
                        Support: DICOM, PNG, JPG (Max 5MB)
                      </p>
                    </>
                  ) : (
                    <div className="relative w-full h-56 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-contain w-full h-auto"
                      />
                      <button
                        onClick={clearFile}
                        className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  )}

                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </div>

                {/* big run button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={!file || loading}
                    className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-200 ${
                      !file || loading
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-5 h-5" />
                        Processing Examination...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Run Analysis
                        {!(!file || loading) && (
                          <Zap className="w-5 h-5 text-white/90" />
                        )}
                      </span>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="mt-3 text-center text-sm text-rose-600">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Right info column */}
            <div className="col-span-1 md:col-span-2" />
          </div>
        </div>

        {/* Decorative side fades */}
        <div className="pointer-events-none absolute -left-10 top-0 bottom-0 w-40 bg-gradient-to-r from-sky-50 to-transparent rounded-r-3xl opacity-80"></div>
        <div className="pointer-events-none absolute -right-10 top-0 bottom-0 w-40 bg-gradient-to-l from-sky-50 to-transparent rounded-l-3xl opacity-80"></div>
      </div>
    </div>
  );
};

export default ImageUploadScreen;
