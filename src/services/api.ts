export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

export interface Doctor {
    id: string;
    userId: string;
    specialization: string[];
    qualifications: string[];
    noOfPatients:number
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

export interface Lab {
    id: string;
    hospitalId: string;
    name: string;
    services: string[];
    locationId: string;
    location: {
        id: string;
        lat: number;
        lng: number;
        address: string;
    };
    hospital: Hospital;
}

export interface DoctorHospitalData {
    id: string;
    doctorId: string;
    hospitalId: string;
    doctor: Doctor;
    hospital: Hospital;
    
}

export interface Appointment {
    id: string;
    doctorId: string;
    userId: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
}

export const fetchDoctors = async (): Promise<DoctorHospitalData[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/search/doctors`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
};

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

export const fetchLabs = async (service?: string): Promise<Lab[]> => {
    try {
        const url = service 
            ? `${API_BASE_URL}/labs/all?service=${encodeURIComponent(service)}`
            : `${API_BASE_URL}/labs/all`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching labs:', error);
        throw error;
    }
};

export const createAppointment = async (appointmentData: {
    doctorId: string;
    scheduledAt: string;
}): Promise<Appointment> => {
    
    try {console.log("reached here");
    
        const response = await fetch(`${API_BASE_URL}/appointments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(appointmentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
};