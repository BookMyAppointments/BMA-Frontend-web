import { useState } from 'react'
import type { FC } from 'react'

interface BaseBooking {
    id: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed';
    type: 'doctor' | 'test';
}

interface DoctorBooking extends BaseBooking {
    type: 'doctor';
    doctorName: string;
    doctorImage: string;
    qualification: string;
    specialization: string;
    hospital: string;
    location: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

interface TestBooking extends BaseBooking {
    type: 'test';
    testName: string;
    testIcon: string;
    labName: string;
    location: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    sampleCollection: 'lab' | 'home';
}

type Booking = DoctorBooking | TestBooking;

interface RescheduleData {
    date: string;
    time: string;
}

const BookingsList: FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [rescheduleData, setRescheduleData] = useState<RescheduleData>({
        date: '',
        time: ''
    });

    const bookings: Booking[] = [
        {
            id: '1',
            type: 'doctor',
            doctorName: 'Dr. James Deen Avora',
            doctorImage: '/doctors/doctor1.png',
            qualification: 'MBBS, MD. in Pulmonology',
            specialization: 'General Physician',
            hospital: 'Apollo Super Speciality Hospital',
            location: 'Gachibowli, Hyderabad',
            coordinates: {
                lat: 17.4400,
                lng: 78.3489
            },
            date: 'Mar 06, 2025',
            time: '10:30 AM',
            status: 'upcoming'
        },
        {
            id: '2',
            type: 'doctor',
            doctorName: 'Dr. Sarah Johnson',
            doctorImage: '/doctors/doctor2.png',
            qualification: 'MBBS, MS. in Orthopedics',
            specialization: 'Orthopedic Surgeon',
            hospital: 'Care Hospitals',
            location: 'Banjara Hills, Hyderabad',
            coordinates: {
                lat: 17.4200,
                lng: 78.4489
            },
            date: 'Feb 15, 2024',
            time: '11:00 AM',
            status: 'completed'
        },
        {
            id: '3',
            type: 'test',
            testName: 'Complete Blood Count (CBC)',
            testIcon: '/icons/test-tube.png',
            labName: 'LifeCare Diagnostics',
            location: 'Jubilee Hills, Hyderabad',
            coordinates: {
                lat: 17.4300,
                lng: 78.4089
            },
            date: 'Mar 10, 2025',
            time: '09:00 AM',
            status: 'upcoming',
            sampleCollection: 'home'
        },
        {
            id: '4',
            type: 'test',
            testName: 'Lipid Profile',
            testIcon: '/icons/test-tube.png',
            labName: 'Apollo Diagnostics',
            location: 'Madhapur, Hyderabad',
            coordinates: {
                lat: 17.4500,
                lng: 78.3789
            },
            date: 'Jan 20, 2024',
            time: '08:30 AM',
            status: 'completed',
            sampleCollection: 'lab'
        }
    ];

    const filteredBookings = bookings.filter(booking => {
        const isMatchingStatus = booking.status === activeTab;
        const searchTerm = searchQuery.toLowerCase();
        
        if (booking.type === 'doctor') {
            return isMatchingStatus && (
                searchTerm === '' ||
                booking.doctorName.toLowerCase().includes(searchTerm) ||
                booking.hospital.toLowerCase().includes(searchTerm)
            );
        } else {
            return isMatchingStatus && (
                searchTerm === '' ||
                booking.testName.toLowerCase().includes(searchTerm) ||
                booking.labName.toLowerCase().includes(searchTerm)
            );
        }
    });

    const openGoogleMaps = (coordinates: { lat: number; lng: number }) => {
        window.open(`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=17`, '_blank');
    };

    const handleReschedule = (booking: Booking) => {
        setSelectedBooking(booking);
        setRescheduleData({
            date: booking.date,
            time: booking.time
        });
        setIsRescheduleModalOpen(true);
    };
    const handleRescheduleSubmit = () => {
        // Here you would typically make an API call to update the booking
        console.log('Rescheduling booking:', selectedBooking?.id, rescheduleData);
        setIsRescheduleModalOpen(false);
    };

    // Add these modal components before the return statement
    // Update DetailsModal backdrop
    const renderBookingCard = (booking: Booking) => (
        <div key={booking.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
                {booking.type === 'doctor' ? (
                    <>
                        <img
                            src={booking.doctorImage}
                            alt={booking.doctorName}
                            className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover mx-auto sm:mx-0"
                        />
                        <div className="flex-1 space-y-3">
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-800">{booking.doctorName}</h3>
                                <p className="text-gray-600">{booking.qualification}</p>
                                <p className="text-gray-500 text-sm">{booking.specialization}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>{booking.hospital}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto sm:mx-0">
                            <img src={booking.testIcon} alt={booking.testName} className="w-8 h-8" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-800">{booking.testName}</h3>
                                <p className="text-gray-600">{booking.labName}</p>
                                <p className="text-gray-500 text-sm">
                                    Sample Collection: {booking.sampleCollection === 'home' ? 'Home' : 'Lab'}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex flex-col sm:flex-row justify-center sm:justify-end gap-3">
                    {booking.status === 'upcoming' ? (
                        <>
                            <button
                                onClick={() => handleReschedule(booking)}
                                className="w-full sm:w-auto px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
                            >
                                Reschedule
                            </button>
                            <button
                                onClick={() => openGoogleMaps(booking.coordinates)}
                                className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                View Location
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => openGoogleMaps(booking.coordinates)}
                            className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            View Location
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    // Update DetailsModal to handle both types
    const DetailsModal = () => (
        selectedBooking && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">
                            {selectedBooking.type === 'doctor' ? 'Appointment' : 'Test'} Details
                        </h3>
                        <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        {selectedBooking.type === 'doctor' ? (
                            <>
                                <div className="flex items-center gap-4">
                                    <img src={selectedBooking.doctorImage} alt={selectedBooking.doctorName} className="w-20 h-20 rounded-full object-cover" />
                                    <div>
                                        <h4 className="text-lg font-semibold">{selectedBooking.doctorName}</h4>
                                        <p className="text-gray-600">{selectedBooking.qualification}</p>
                                        <p className="text-gray-500">{selectedBooking.specialization}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                                        <img src={selectedBooking.testIcon} alt={selectedBooking.testName} className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold">{selectedBooking.testName}</h4>
                                        <p className="text-gray-600">{selectedBooking.labName}</p>
                                        <p className="text-gray-500">Sample Collection: {selectedBooking.sampleCollection}</p>
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            {selectedBooking.type === 'doctor' ? (
                                <div>
                                    <p className="text-gray-500">Hospital</p>
                                    <p className="font-medium">{selectedBooking.hospital}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-500">Lab</p>
                                    <p className="font-medium">{selectedBooking.labName}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-gray-500">Location</p>
                                <p className="font-medium">{selectedBooking.location}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Date</p>
                                <p className="font-medium">{selectedBooking.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Time</p>
                                <p className="font-medium">{selectedBooking.time}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => setIsDetailsModalOpen(false)}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    // Update RescheduleModal backdrop
    const RescheduleModal = () => (
        selectedBooking && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold">Reschedule Appointment</h3>
                        <button onClick={() => setIsRescheduleModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={rescheduleData.date}
                                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Time</label>
                            <input
                                type="time"
                                value={rescheduleData.time}
                                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setIsRescheduleModalOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleRescheduleSubmit}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Confirm Reschedule
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    return (
        <>
        <div className="w-[97%] mx-auto mt-6 mb-8">
            <div className="bg-white rounded-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Your Appointments</h2>

                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-4 py-2 rounded-full ${activeTab === 'upcoming'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Upcoming Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-4 py-2 rounded-full ${activeTab === 'completed'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Completed Appointments
                    </button>
                </div>
                <div className="space-y-4">
                    {filteredBookings.map(booking => renderBookingCard(booking))}
                </div>

                {filteredBookings.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                )}
            </div>
        </div>
            { isDetailsModalOpen && <DetailsModal /> }
            { isRescheduleModalOpen && <RescheduleModal /> }
            </>
    );
}

export default BookingsList