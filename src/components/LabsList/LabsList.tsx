import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLabs } from '../../hooks/useLabs'
import type { Lab } from '../../services/api'

interface LabsListProps {
    selectedService?: string;
    labId?: string;
    labs?: Lab[];
}

const LabsList: FC<LabsListProps> = ({ selectedService, labs: providedLabs }) => {
    const navigate = useNavigate();
    const { labs: fetchedLabs, loading, error } = useLabs(selectedService);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Use provided labs if available, otherwise use fetched labs
    const labs = providedLabs || fetchedLabs;

    // Reset to first page when service changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedService]);

    if (loading) {
        return (
            <div className="w-full p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-1 w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6">
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg mb-2">⚠️</div>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (labs.length === 0) {
        return (
            <div className="w-full p-6">
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🏥</div>
                    <p className="text-gray-600 text-lg">No labs found</p>
                    {selectedService && (
                        <p className="text-gray-500 text-sm mt-2">
                            Try selecting a different service category
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(labs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedLabs = labs.slice(startIndex, startIndex + itemsPerPage);

    const handleLabClick = (labId: string) => {
        navigate(`/lab/${labId}`);
    };

    return (
        <div className="w-full p-3 sm:p-4 lg:p-6">
            <div className="mb-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                    Available Labs
                    {selectedService && (
                        <span className="text-blue-600 ml-2">
                            for {selectedService}
                        </span>
                    )}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    {labs.length} lab{labs.length !== 1 ? 's' : ''} found
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedLabs.map((lab) => (
                    <div
                        key={lab.id}
                        onClick={() => handleLabClick(lab.id)}
                        className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border hover:border-blue-200"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <img 
                                    src="/icons/lab-gray.png" 
                                    alt="Lab Icon" 
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                                    {lab.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                                    {lab.hospital.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    📍 {lab.location.address}
                                </p>
                                
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-1">
                                        {lab.services.slice(0, 2).map((service, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                                            >
                                                {service}
                                            </span>
                                        ))}
                                        {lab.services.length > 2 && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                +{lab.services.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-yellow-400">⭐</span>
                                    <span className="text-sm font-medium text-gray-700">4.5</span>
                                    <span className="text-xs text-gray-500">(150+ reviews)</span>
                                </div>
                                <span className="text-xs text-blue-600 font-medium hover:underline">
                                    View Details →
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        ←
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm
                                    ${currentPage === pageNum 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

export default LabsList
