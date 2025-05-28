import type { FC } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Test {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    preparation: string[];
}

const TestsList: FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const tests: Test[] = [
        {
            id: '1',
            name: 'Complete Blood Count (CBC)',
            description: 'Measures different components of blood including red cells, white cells, and platelets',
            price: 500,
            duration: '1 day',
            preparation: ['Fasting for 8-12 hours', 'Avoid smoking']
        },
        {
            id: '2',
            name: 'Lipid Profile',
            description: 'Measures cholesterol levels and other blood fats',
            price: 800,
            duration: '1 day',
            preparation: ['12-14 hours fasting', 'Avoid fatty foods']
        },
        // Add more tests as needed
    ];

    const totalPages = Math.ceil(tests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTests = tests.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedTests.map((test) => (
                    <div
                        key={test.id}
                        onClick={() => navigate(`/test/${test.id}`)}
                        className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <img 
                                    src="/icons/test-tube.png" 
                                    alt="Test Icon" 
                                    className="w-5 h-5"
                                />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                                    {test.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Duration: {test.duration}
                                </p>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {test.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-blue-600 font-semibold">₹{test.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                ${currentPage === page 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TestsList