import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import SuccessPopup from '../SuccessPopup/SuccessPopup'

const BookingForm: FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const timeSlots = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
        '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
    ];

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
                {/* Doctor Info Section */}
                <div className="flex items-center gap-4 pb-6 border-b">
                    <img 
                        src="/doctors/doctor1.png"
                        alt="Dr. James Deen Avora"
                        className="w-auto h-20 rounded-full object-fit"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Dr. James Deen Avora</h2>
                        <p className="text-gray-600">MBBS, MD. in Pulmonology</p>
                        <p className="text-gray-500 text-sm">Apollo Super Speciality Hospital</p>
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
                                    <div className="grid grid-cols-3 gap-3">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`px-4 py-2 rounded-lg border ${
                                                    selectedTime === time 
                                                        ? 'bg-blue-50 border-blue-500 text-blue-600' 
                                                        : 'border-gray-200 hover:border-blue-500'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Important Information</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Video consultation will be scheduled for 15 minutes</li>
                                <li>• Prescription will be provided after the consultation</li>
                                <li>• Free follow-up available for 3 days</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Section - Booking Summary */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                {selectedDate && selectedTime && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Appointment</span>
                                            <span className="font-medium">
                                                {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                    </>
                                )}
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Consultation Fee</span>
                                    <span className="font-medium">₹799</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Platform Fee</span>
                                    <span className="font-medium">₹2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes</span>
                                    <span className="font-medium">₹32.7</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="font-medium text-blue-600">₹834.7</span>
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
                    </div>
                </div>
            </div>

            <SuccessPopup isVisible={showSuccessPopup} />
        </div>
    )
}

export default BookingForm