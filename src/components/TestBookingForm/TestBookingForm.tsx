import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../SuccessPopup/SuccessPopup'

const TestBookingForm: FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [sampleCollection, setSampleCollection] = useState<'lab' | 'home'>('lab');

    const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
        '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        setShowSuccessPopup(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
            navigate('/bookings');
        }, 2000);
    };

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
                        <h2 className="text-xl font-semibold text-gray-800">Complete Blood Count (CBC)</h2>
                        <p className="text-gray-600">Duration: 1 day</p>
                        <p className="text-gray-500 text-sm">LifeCare Diagnostics</p>
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
                                    <span className="text-gray-800 font-medium">₹500</span>
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
                                            ₹{sampleCollection === 'home' ? 600 : 500}
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