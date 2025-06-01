import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../SuccessPopup/SuccessPopup'
import { API_BASE_URL } from '../../services/api'

interface Test {
    id: string;
    name: string;
    category: string;
    price: number;
    homeSample: boolean;
    labId: string;
}

interface Lab {
    id: string;
    name: string;
    location: {
        address: string;
        lat: number;
        lng: number;
    };
}

interface TestBookingFormProps {
    testId: string;
    labId: string;
}

const TestBookingForm: FC<TestBookingFormProps> = ({ testId, labId }) => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [sampleCollection, setSampleCollection] = useState<'lab' | 'home'>('lab');
    const [test, setTest] = useState<Test | null>(null);
    const [lab, setLab] = useState<Lab | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
        '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

    useEffect(() => {
        const fetchTestAndLabDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch test details
                const testResponse = await fetch(`${API_BASE_URL}/tests/${testId}`);
                if (!testResponse.ok) {
                    throw new Error('Failed to fetch test details');
                }
                const testData = await testResponse.json();
                setTest(testData);

                // Fetch lab details
                const labResponse = await fetch(`${API_BASE_URL}/labs/${labId}`);
                if (!labResponse.ok) {
                    throw new Error('Failed to fetch lab details');
                }
                const labData = await labResponse.json();
                setLab(labData);

            } catch (err) {
                console.error('Error fetching details:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch details');
            } finally {
                setLoading(false);
            }
        };

        fetchTestAndLabDetails();
    }, [testId, labId]);

    const handleBooking = async () => {
        try {
            if (!selectedDate || !selectedTime || !test || !lab) {
                alert('Please select both date and time');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Combine date and time into a single datetime string
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();

            const response = await fetch(`${API_BASE_URL}/appointments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    labId: lab.id,
                    testId: test.id,
                    scheduledAt,
                    sampleCollection
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to book test');
            }

            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false);
                navigate('/bookings');
            }, 2000);
        } catch (err) {
            console.error('Error booking test:', err);
            setError(err instanceof Error ? err.message : 'Failed to book test');
        }
    };

    if (loading) {
        return (
            <div className="w-[97%] mx-auto mt-6">
                <div className="bg-white rounded-lg p-6">
                    <div className="flex justify-center items-center min-h-[200px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[97%] mx-auto mt-6">
                <div className="bg-white rounded-lg p-6">
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
            </div>
        );
    }

    if (!test || !lab) {
        return (
            <div className="w-[97%] mx-auto mt-6">
                <div className="bg-white rounded-lg p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-600">Test or lab details not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[97%] mx-auto mt-6">
            <div className="bg-white rounded-lg p-6">
                {/* Test Info Section */}
                <div className="flex items-center gap-4 pb-6 border-b">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <img 
                            src="/icons/test-tube.png"
                            alt="Test Icon"
                            className="w-8 h-8"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{test.name}</h2>
                        <p className="text-gray-600">Category: {test.category}</p>
                        <p className="text-gray-500 text-sm">{lab.name}</p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Section - Date & Time Selection */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date & Time</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">Select Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-600 mb-2">Select Time</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`px-4 py-2 rounded-lg border ${
                                                    selectedTime === time
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'border-gray-200 text-gray-600 hover:border-blue-500'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {test.homeSample && (
                                    <div>
                                        <label className="block text-gray-600 mb-2">Sample Collection</label>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setSampleCollection('lab')}
                                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                                    sampleCollection === 'lab'
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'border-gray-200 text-gray-600 hover:border-blue-500'
                                                }`}
                                            >
                                                At Lab
                                            </button>
                                            <button
                                                onClick={() => setSampleCollection('home')}
                                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                                    sampleCollection === 'home'
                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                        : 'border-gray-200 text-gray-600 hover:border-blue-500'
                                                }`}
                                            >
                                                Home Collection
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Summary */}
                    <div className="lg:border-l lg:pl-6">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Test Price</span>
                                    <span className="text-gray-800 font-medium">₹{test.price}</span>
                                </div>
                                {sampleCollection === 'home' && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Home Collection Charge</span>
                                        <span className="text-gray-800 font-medium">₹100</span>
                                    </div>
                                )}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-semibold">Total Amount</span>
                                        <span className="text-blue-600 font-semibold text-lg">
                                            ₹{sampleCollection === 'home' ? test.price + 100 : test.price}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={!selectedDate || !selectedTime}
                                className={`w-full bg-blue-500 text-white rounded-lg py-3 transition-colors ${
                                    (!selectedDate || !selectedTime) 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:bg-blue-600'
                                }`}
                            >
                                Confirm Booking
                            </button>

                            <SuccessPopup isVisible={showSuccessPopup} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestBookingForm