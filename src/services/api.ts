const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

export interface Doctor {
    id: string;
    userId: string;
    specialization: string[];
    qualifications: string[];
    ratings: number;
    about: string;
    price: number;
    user: {
        id: string;
        name: string;
        email: string;
        profile: string | null;
    };
    availability: Array<{
        id: string;
        doctorId: string;
        day: string;
        startTime: string;
        endTime: string;
        labId: string | null;
    }>;
    reviews: Array<{
        id: string;
        doctorId: string;
        userId: string;
        rating: number;
        comment: string;
        createdAt: string;
    }>;
}

export interface Hospital {
    id: string;
    name: string;
    departments: string[];
    facilities: string[];
    services: string[];
    hours: string;
    locationId: string;
    location: {
        id: string;
        lat: number;
        lng: number;
        address: string;
    };
}

export interface DoctorHospitalData {
    id: string;
    doctorId: string;
    hospitalId: string;
    doctor: Doctor;
    hospital: Hospital;
}

export const fetchDoctorsBySpecialization = async (specialization: string): Promise<DoctorHospitalData[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/search/doctors?specialization=${encodeURIComponent(specialization)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
};