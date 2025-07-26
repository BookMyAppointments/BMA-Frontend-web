// Enums
export enum Role {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// Interfaces
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  verifyCode?: string;
  verified: boolean;
  gender?: Gender;
  dob?: Date;
  address?: string;
  picture?: string;
  locationId?: string;
  role: Role;
  medicalRecord: MedicalRecord[];
  appointments: Appointment[];
  testResults: TestResult[];
  notifications: Notification[];
  requests: Request[];
  reviews: Review[];
  hospitals: Hospital[];
  location?: Location;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  email: string;
  name: string;
  phone?: string;
  picture?: string;
  specialization: string[];
  qualifications: string[];
  ratings?: number;
  about?: string;
  price: number;
  noOfPatients: number;
  reviews: Review[];
  availability: Availability[];
  appointments: Appointment[];
  hospitalId?: string;
  hospital?: Hospital;
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
  hours: any; // JSON
  noOfPatients: number;
  adminId?: string;
  admin?: User;
  reviews: Review[];
  doctors: Doctor[];
  labs: Lab[];
  status: Status;
  locationId: string;
  request?: Request;
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

export interface Availability {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  doctorId?: string;
  doctor?: Doctor;
  labId?: string;
  lab?: Lab;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId?: string;
  labId?: string;
  testId?: string;
  status: AppointmentStatus;
  scheduledAt: Date;
  rescheduledAt?: Date;
  cancelledAt?: Date;
  user: User;
  doctor?: Doctor;
  lab?: Lab;
  test?: MedicalTest;
}

export interface Lab {
  id: string;
  name: string;
  picture?: string;
  description?: string;
  banner?: string;
  address?: string;
  services: string[];
  hours?: any;
  noOfPatients: number;
  locationId: string;
  location: Location;
  hospitalId?: string;
  hospital?: Hospital;
  availability: Availability[];
  tests: MedicalTest[];
  appointments: Appointment[];
  status: Status;
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
  results: TestResult[];
  appointments: Appointment[];
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

export interface Request {
  id: string;
  userEmail: string;
  expiryTime: Date;
  status: Status;
  hospitalId?: string;
  hospital?: Hospital;
  userId?: string;
  user?: User;
}

export interface Location {
  id?: string;
  lat: number;
  lng: number;
  address: string;
  hospitals?: Hospital[];
  users?: User[];
  labs?: Lab[];
}

export interface Link {
  id: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerImages {
  id: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
