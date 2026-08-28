import HospitalForm from "../../admin/hospital/create/hospitalForm";
import { Suspense } from "react";
import { Building, Loader2 } from "lucide-react";

function HospitalFormLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="border-b border-gray-200 pb-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Building className="text-blue-600" size={32} />
                            Register a Hospital
                        </h1>
                        <p className="text-gray-600 mt-2">A super admin reviews this before it goes live.</p>
                    </div>
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3 text-blue-600">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="text-lg">Loading form...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<HospitalFormLoading />}>
            <HospitalForm />
        </Suspense>
    )
}
