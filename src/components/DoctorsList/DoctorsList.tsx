import type { FC } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Doctor {
    id: string;
    name: string;
    image: string;
    qualification: string;
    specialization: string;
    rating: number;
    patientsCount: string;
}

const DoctorsList: FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const doctors: Doctor[] = [
        {
            id: '1',
            name: 'Dr. James Deen Avora',
            image: '/doctors/doctor1.jpg',
            qualification: 'MBBS, MD. in Pulmonology,',
            specialization: 'General Physician',
            rating: 4.6,
            patientsCount: '1200+'
        },
        {
            id: '2',
            name: 'Dr. Priya Sharma',
            image: '/doctors/doctor2.jpg',
            qualification: 'MBBS, MS in General Surgery',
            specialization: 'General Surgeon',
            rating: 4.8,
            patientsCount: '1500+'
        },
        {
            id: '3',
            name: 'Dr. Rahul Mehta',
            image: '/doctors/doctor3.jpg',
            qualification: 'MBBS, MD in Cardiology',
            specialization: 'Cardiologist',
            rating: 4.7,
            patientsCount: '1100+'
        },
        {
            id: '4',
            name: 'Dr. Ayesha Khan',
            image: '/doctors/doctor4.jpg',
            qualification: 'MBBS, DGO',
            specialization: 'Gynecologist',
            rating: 4.9,
            patientsCount: '1800+'
        },
        {
            id: '5',
            name: 'Dr. Vikram Patel',
            image: '/doctors/doctor5.jpg',
            qualification: 'MBBS, MD in Dermatology',
            specialization: 'Dermatologist',
            rating: 4.5,
            patientsCount: '950+'
        },
        {
            id: '6',
            name: 'Dr. Sneha Reddy',
            image: '/doctors/doctor6.jpg',
            qualification: 'MBBS, MS in ENT',
            specialization: 'ENT Specialist',
            rating: 4.6,
            patientsCount: '1300+'
        },
        {
            id: '7',
            name: 'Dr. Rohan Deshmukh',
            image: '/doctors/doctor7.jpg',
            qualification: 'MBBS, MD in Pediatrics',
            specialization: 'Pediatrician',
            rating: 4.8,
            patientsCount: '1700+'
        },
        {
            id: '8',
            name: 'Dr. Neha Agarwal',
            image: '/doctors/doctor8.jpg',
            qualification: 'MBBS, MD in Psychiatry',
            specialization: 'Psychiatrist',
            rating: 4.4,
            patientsCount: '800+'
        },
        {
            id: '9',
            name: 'Dr. Arjun Varma',
            image: '/doctors/doctor9.jpg',
            qualification: 'MBBS, DM in Neurology',
            specialization: 'Neurologist',
            rating: 4.7,
            patientsCount: '1250+'
        },
        {
            id: '10',
            name: 'Dr. Meera Iyer',
            image: '/doctors/doctor10.jpg',
            qualification: 'MBBS, MS in Ophthalmology',
            specialization: 'Ophthalmologist',
            rating: 4.6,
            patientsCount: '1000+'
        },
        {
            id: '11',
            name: 'Dr. Karthik Raj',
            image: '/doctors/doctor11.jpg',
            qualification: 'MBBS, MCh in Urology',
            specialization: 'Urologist',
            rating: 4.5,
            patientsCount: '900+'
        },
        {
            id: '12',
            name: 'Dr. Anjali Nair',
            image: '/doctors/doctor12.jpg',
            qualification: 'MBBS, MD in Radiology',
            specialization: 'Radiologist',
            rating: 4.6,
            patientsCount: '1100+'
        },
        {
            id: '13',
            name: 'Dr. Sandeep Rathi',
            image: '/doctors/doctor13.jpg',
            qualification: 'MBBS, MD in Oncology',
            specialization: 'Oncologist',
            rating: 4.8,
            patientsCount: '1400+'
        },
        {
            id: '14',
            name: 'Dr. Tara Joshi',
            image: '/doctors/doctor14.jpg',
            qualification: 'MBBS, MD in Endocrinology',
            specialization: 'Endocrinologist',
            rating: 4.7,
            patientsCount: '1050+'
        },
        {
            id: '15',
            name: 'Dr. Nikhil Saxena',
            image: '/doctors/doctor15.jpg',
            qualification: 'MBBS, DNB in Orthopedics',
            specialization: 'Orthopedic Surgeon',
            rating: 4.6,
            patientsCount: '1250+'
        },
        {
            id: '16',
            name: 'Dr. Kavitha Das',
            image: '/doctors/doctor16.jpg',
            qualification: 'MBBS, MD in Nephrology',
            specialization: 'Nephrologist',
            rating: 4.5,
            patientsCount: '950+'
        },
        {
            id: '17',
            name: 'Dr. Harish Shetty',
            image: '/doctors/doctor17.jpg',
            qualification: 'MBBS, DM in Gastroenterology',
            specialization: 'Gastroenterologist',
            rating: 4.7,
            patientsCount: '1150+'
        }        
        // Add more doctors here
    ]

    const totalPages = Math.ceil(doctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedDoctors = doctors.slice(startIndex, startIndex + itemsPerPage);

    const handleDoctorClick = (doctorId: string) => {
        navigate(`/doctor/${doctorId}`);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 lg:gap-6 px-2 lg:px-6 w-full lg:grid-cols-3">
                {displayedDoctors.map((doctor) => (
                    <div 
                        key={doctor.id}
                        onClick={() => handleDoctorClick(doctor.id)}
                        className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                    >
                        <div className="flex gap-3 lg:gap-4 items-start">
                            <img 
                                src={doctor.image} 
                                alt={doctor.name} 
                                className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="text-gray-800 font-semibold text-base lg:text-lg">{doctor.name}</h3>
                                <p className="text-gray-500 text-xs lg:text-sm mt-0.5">
                                    {doctor.qualification}
                                </p>
                                <p className="text-gray-500 text-xs lg:text-sm">
                                    {doctor.specialization}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4 px-3 py-2.5 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-800 font-medium">{doctor.rating}</span>
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-gray-500 text-sm">Rating</span>
                            </div>
                            <div>
                                <span className="text-gray-800 font-medium">{doctor.patientsCount}</span>
                                <span className="text-gray-500 text-sm ml-1.5">Patients</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pb-4 items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 text-sm rounded-lg flex items-center justify-center ${
                                    currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default DoctorsList