import { useParams } from 'react-router-dom';
import { Printer, Download } from 'lucide-react';

const MedicalReportScreen = () => {
    const { id } = useParams();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 fade-in pb-20">
            <div className="flex justify-between items-center print:hidden">
                <h2 className="text-2xl font-bold">Medical Report Preview</h2>
                <div className="flex gap-4">
                    <button onClick={handlePrint} className="btn btn-outline space-x-2">
                        <Printer size={18} />
                        <span>Print</span>
                    </button>
                    <button className="btn btn-primary space-x-2">
                        <Download size={18} />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>

            {/* Report Paper */}
            <div className="bg-white text-black p-12 rounded-[var(--radius-lg)] shadow-xl min-h-[1000px] relative overflow-hidden">
                {/* Header */}
                <div className="border-b-2 border-slate-200 pb-8 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Coronary Angiography Report</h1>
                        <p className="text-slate-500 mt-2">AI-Assisted Analysis & Clinical Verification</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-slate-700">Code Unnati Healthcare</p>
                        <p className="text-sm text-slate-500">Report ID: {id}</p>
                        <p className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Patient & Case Info */}
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">Patient Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-slate-500">Name:</span> <span className="font-medium">John Doe (Mock)</span>
                            <span className="text-slate-500">Age/Sex:</span> <span className="font-medium">65 / M</span>
                            <span className="text-slate-500">Patient ID:</span> <span className="font-medium">PT-{id}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">Clinical Indication</h3>
                        <p className="text-sm text-slate-700">Suspected Coronary Artery Disease. Stable Angina.</p>
                    </div>
                </div>

                {/* Analysis Findings */}
                <div className="mb-12">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm border-b border-slate-100 pb-4 mb-6">Angiographic Findings</h3>

                    <div className="flex gap-8 items-start">
                        <div className="w-1/2">
                            <div className="aspect-square bg-black rounded-lg overflow-hidden relative border border-slate-200">
                                <img
                                    src="https://via.placeholder.com/600x600?text=Angiography+Report"
                                    alt="Angiogram"
                                    className="w-full h-full object-cover"
                                />
                                {/* Static overlay for print */}
                                <div
                                    className="absolute border-2 border-red-500"
                                    style={{
                                        left: `40%`,
                                        top: `30%`,
                                        width: `20%`,
                                        height: `20%`,
                                    }}
                                />
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-2">Figure 1. Automated Stenosis Detection</p>
                        </div>

                        <div className="w-1/2 space-y-6">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Vessel Segment</p>
                                <p className="text-lg font-bold text-slate-900">Right Coronary Artery (RCA)</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Stenosis Grade</p>
                                <p className="text-lg font-bold text-red-600">Severe (75% Diameter Reduction)</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">AI Confidence</p>
                                <p className="text-lg font-medium text-slate-900">92%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctor Verification */}
                <div className="mb-12 bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm mb-4">Clinical Verification</h3>
                    <p className="text-slate-700 leading-relaxed">
                        The AI-generated findings have been reviewed and verified. The detected stenosis in the RCA is consistent with visual assessment.
                        Recommended proceeding with intervention planning.
                    </p>
                </div>

                {/* Signature */}
                <div className="absolute bottom-12 right-12 w-64 text-center">
                    <div className="h-16 flex items-end justify-center">
                        {/* Mock Signature */}
                        <span className="font-cursive text-2xl text-slate-800 italic">Dr. Jane Doe</span>
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                        <p className="font-bold text-slate-900">Dr. Jane Doe</p>
                        <p className="text-xs text-slate-500">Cardiologist, MD</p>
                    </div>
                </div>

                <div className="absolute bottom-12 left-12 text-xs text-slate-400">
                    Generated by CAD-AI System v1.0
                </div>
            </div>
        </div>
    );
};

export default MedicalReportScreen;
