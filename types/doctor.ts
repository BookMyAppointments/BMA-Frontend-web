export interface DoctorHospitalData {
    id: string;
    doctorId: string;
    hospitalId: string;
    doctor: Doctor;
    hospital: Hospital;

}

export enum Role {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN'
}

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED'
}

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    RESCHEDULED = 'RESCHEDULED'
}

// Base interfaces
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    phone?: string;
    verifyCode?: string;
    verified: boolean;
    gender?: string;
    dob?: Date;
    address?: string;
    picture?: string;
    locationId?: string;
    role: Role;
    medicalRecord?: MedicalRecord[];
    appointments?: Appointment[];
    testResults?: TestResult[];
    notifications?: Notification[];
    reviews?: Review[];
    location?: Location;
    createdAt: Date;
    updatedAt: Date;
}

export interface Doctor {
    id: string;
    email: string;
    name: string;
    phone?: string;
    specialization: string[];
    qualifications: string[];
    ratings?: number;
    about?: string;
    price: number;
    noOfPatients: number;
    reviews?: Review[];
    availability?: Availability[];
    appointments?: Appointment[];
    hospitalId?: string;
    hospital?: Hospital;
    // Additional fields that might be needed from API responses
    user?: User;
    patientsCount?: number;
}

export interface Hospital {
    id: string;
    name: string;
    picture?: string;
    description?: string;
    banner?: string;
    address?: string;
    departments: string[];
    facilities: string[];
    services: string[];
    hours: any; // JSON type
    noOfPatients: number;
    reviews?: Review[];
    doctors?: Doctor[];
    labs?: Lab[];
    status: Status;
    locationId: string;
    location: Location;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    id: string;
    userId?: string;
    rating: number;
    comment?: string;
    doctorId?: string;
    hospitalId?: string;
    user?: User;
    doctor?: Doctor;
    hospital?: Hospital;
    createdAt: Date;
}

export interface Link {
    id: string;
    url: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Availability {
    id: string;
    doctorId: string;
    day: string;
    startTime: string;
    endTime: string;
    doctor?: Doctor;
}

export interface Location {
    id?: string;
    address: string;
    lat?: number;
    lng?: number;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    users?: User[];
    hospitals?: Hospital[];
    labs?: Lab[];
}

export interface Appointment {
    id: string;
    userId: string;
    doctorId?: string;
    testId?: string;
    hospitalId?: string;
    labId?: string;
    appointmentDate: Date;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
    user: User;
    doctor?: Doctor;
    test?: MedicalTest;
    hospital?: Hospital;
    lab?: Lab;
    createdAt: Date;
    updatedAt: Date;
}

export interface Lab {
    id: string;
    name: string;
    picture?: string;
    description?: string;
    banner?: string;
    address?: string;
    services: string[];
    hours: any; // JSON type
    noOfPatients: number;
    reviews?: Review[];
    tests: MedicalTest[];
    appointments?: Appointment[];
    status: Status;
    locationId: string;
    location: Location;
    createdAt: Date;
    updatedAt: Date;
}

export interface MedicalTest {
    id: string;
    name: string;
    category: string;
    price: number;
    homeSample: boolean;
    labId: string;
    lab: Lab;
    results?: TestResult[];
    appointments?: Appointment[];
}

export interface TestResult {
    id: string;
    userId: string;
    testId: string;
    result: string;
    issuedAt: Date;
    user: User;
    test: MedicalTest;
}

export interface Notification {
    id: string;
    userId: string;
    type: AppointmentStatus;
    message: string;
    read: boolean;
    createdAt: Date;
    user: User;
}

export interface MedicalRecord {
    id: string;
    userId: string;
    history: string[];
    documents: string[];
    user: User;
}
