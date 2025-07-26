import { useState } from 'react'
import type { FC } from 'react'
import SuccessPopup from '@/components/ui/SuccessPopup'
import type { Doctor } from "@/types/doctor"
import { createAppointment } from '@/services/api'
import { toast } from 'react-toastify';
import Image from 'next/image'

interface Availability {
    day: string;
    startTime: string;
    endTime: string;
}

interface DateChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement;
}

interface BookingFormProps {
    doctor: Doctor;
}

const BookingForm: FC<BookingFormProps> = ({ doctor }) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    const navigate = (path: string) => {
        window.location.href = path;
    }

    const dates: { [key: number]: string } = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }

    const formatTimeTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = (parseInt(hours, 10) + 12).toString();
        }

        minutes = minutes || '00';

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            return;
        }

        try {
            setIsLoading(true);
            const formattedTime = formatTimeTo24Hour(selectedTime);
            const bookingData = {
                doctorId: ('doctorId' in doctor ? doctor.doctorId : doctor.id) as string,
                scheduledAt: new Date(`${selectedDate}T${formattedTime}`).toISOString(),
            };
            console.log(bookingData);

            await createAppointment(bookingData);
            setShowSuccessPopup(true);
            setTimeout(() => navigate('/bookings'), 2000);
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('Failed to create appointment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const selectDate = (e: DateChangeEvent): void => {
        const day: string = dates[new Date(e.target.value).getDay()];
        setSelectedDate(e.target.value);
        const filteredDoctorData: Availability[] = (doctorData?.availability || []).filter(
            (aval: Availability) => aval.day === day
        );

        // Generate time slots based on availability
        if (filteredDoctorData.length > 0) {
            const slots: string[] = [];
            const startTime = filteredDoctorData[0].startTime; // e.g., "09:00"
            const endTime = filteredDoctorData[0].endTime; // e.g., "17:00"
            
            const [startHour] = startTime.split(':').map(Number);
            const [endHour] = endTime.split(':').map(Number);

            for (let hour = startHour; hour < endHour; hour++) {
                let displayHour = hour;
                let period = 'AM';
                
                if (hour === 0) {
                    displayHour = 12;
                } else if (hour === 12) {
                    period = 'PM';
                } else if (hour > 12) {
                    displayHour = hour - 12;
                    period = 'PM';
                }
                
                const time = `${displayHour}:00 ${period}`;
                slots.push(time);
            }
            setTimeSlots(slots);
        } else {
            setTimeSlots([]);
        }
    }

    const getDoctorData = (): Doctor => {
        if ('doctor' in doctor) {
            return doctor.doctor as Doctor;
        }
        return doctor as Doctor;
    };

    const doctorData = getDoctorData();
    console.log(doctorData);

    return (
        <div className="w-[97%] mx-auto mt-6">
            <div className="bg-white rounded-lg p-6">
                {/* Doctor Info Section */}
                <div className="flex items-center gap-4 pb-6 border-b">
                    <Image
                        width={80}
                        height={80}
                        unoptimized
                        src={doctorData?.picture || '/default-doctor.png'}
                        alt={doctorData?.name || 'Doctor'}
                        className="w-auto h-20 rounded-full object-fit"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Dr. {doctorData?.name || 'Unknown'}</h2>
                        <p className="text-gray-600">{doctorData?.qualifications?.join(', ') || 'No qualifications listed'}</p>
                        <p className="text-gray-500 text-sm">{doctorData?.specialization?.join(', ') || 'No specializations listed'}</p>
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
                                        onChange={selectDate}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 mb-2">Select Time</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {timeSlots.length > 0 ? timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`px-4 py-2 rounded-lg border ${selectedTime === time
                                                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'border-gray-200 hover:border-blue-500'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        )) : "No Available Slots"}
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
                                    <span className="font-medium">₹{doctorData?.price || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Platform Fee</span>
                                    <span className="font-medium">₹2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes</span>
                                    <span className="font-medium">₹{((doctorData?.price || 0) * 0.18).toFixed(1)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total Amount</span>
                                        <span className="font-medium text-blue-600">
                                            ₹{((doctorData?.price || 0) + 2 + ((doctorData?.price || 0) * 0.18)).toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={!selectedDate || !selectedTime || isLoading}
                            className={`w-full bg-blue-500 text-white rounded-lg py-3 transition-colors ${(!selectedDate || !selectedTime || isLoading)
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-600'
                                }`}
                        >
                            {isLoading ? 'Creating Appointment...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>

            <SuccessPopup isVisible={showSuccessPopup} type="doctor" />
        </div>
    );
}

export default BookingForm