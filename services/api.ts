import { Appointment, DoctorHospitalData, Lab } from "@/types/doctor";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

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
        console.log(API_BASE_URL);
        
        const response = await fetch(`${API_BASE_URL}/search/doctors?specialization=${encodeURIComponent(specialization)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched doctors by specialization:", data);
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

    try {
        console.log("reached here");

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

export const fetchUserAppointments = async (status?: string, page: number = 1, limit: number = 10): Promise<{
    appointments: Appointment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}> => {
    try {
        let url = `${API_BASE_URL}/appointments/user/all?page=${page}&limit=${limit}`;
        if (status) {
            url += `&status=${encodeURIComponent(status)}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        throw error;
    }
};

export const fetchDoctorAppointments = async (status?: string, page: number = 1, limit: number = 10): Promise<{
    appointments: Appointment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}> => {
    try {
        let url = `${API_BASE_URL}/appointments/doctor/all?page=${page}&limit=${limit}`;
        if (status) {
            url += `&status=${encodeURIComponent(status)}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        throw error;
    }
};

export const fetchAppointmentById = async (appointmentId: string): Promise<Appointment> => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/get/${appointmentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw error;
    }
};