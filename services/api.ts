import { Appointment, Doctor, Lab } from '@/types/doctor';

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050/api/v1';

export const TOKEN_KEY = 'token';

export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = window.localStorage.getItem(TOKEN_KEY);
    return token && token.length > 0 ? token : null;
}

export function setToken(token: string) {
    window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
    /** Attach the stored bearer token. Defaults to true. */
    auth?: boolean;
}

/**
 * Single entry point for every backend call: attaches auth, parses JSON once,
 * and turns a non-2xx response into an ApiError carrying the server's message
 * so screens can show something specific instead of "Something went wrong".
 */
export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
    const { body, auth = true, headers, ...rest } = options;

    const finalHeaders: Record<string, string> = {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...((headers as Record<string, string>) ?? {}),
    };

    if (auth) {
        const token = getToken();
        if (token) finalHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: finalHeaders,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const text = await response.text();
    const data = text ? safeParse(text) : null;

    if (!response.ok) {
        const message =
            (data && typeof data === 'object' && 'message' in data
                ? String((data as { message: unknown }).message)
                : null) ?? `Request failed (${response.status})`;
        throw new ApiError(message, response.status);
    }

    return data as T;
}

function safeParse(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/* ------------------------------------------------------------- Doctors --- */

export const fetchDoctors = () => api<Doctor[]>('/search/doctors', { auth: false });

export const fetchDoctorsBySpecialization = (specialization: string, treats?: string) => {
    const params = new URLSearchParams({ specialization });
    if (treats) params.set('treats', treats);
    return api<Doctor[]>(`/search/doctors?${params}`, { auth: false });
};

export const fetchDoctorById = (id: string) => api<Doctor>(`/doctors/get/${id}`, { auth: false });

/* ---------------------------------------------------------------- Labs --- */

export const fetchLabs = (service?: string) =>
    api<Lab[]>(`/search/labs${service ? `?service=${encodeURIComponent(service)}` : ''}`, {
        auth: false,
    });

/* -------------------------------------------------------- Appointments --- */

export const createAppointment = (payload: { doctorId?: string; labId?: string; testId?: string; scheduledAt: string }) =>
    api<Appointment>('/appointments/create', { method: 'POST', body: payload });

export const fetchAppointmentById = (appointmentId: string) =>
    api<Appointment>(`/appointments/get/${appointmentId}`);

export const fetchAppointmentsByStatus = (status: string) =>
    api<Appointment[]>(`/search/appointments?status=${encodeURIComponent(status)}`);

export const fetchDoctorAvailability = (doctorId: string) =>
    api<unknown>(`/appointments/doctors/availability/${doctorId}`, { auth: false });

/* ------------------------------------------------------------- Payment --- */

export interface PaymentMethods {
    online: boolean;
    payAtHospital: boolean;
}

export const fetchPaymentMethods = () => api<PaymentMethods>('/payment/methods', { auth: false });

export const createPaymentOrder = (payload: {
    appointmentId: string;
    amount: number;
    method: 'RAZORPAY' | 'PAY_AT_HOSPITAL';
}) => api<{
    payment: { id: string; status: string; method: string; amount: number };
    requiresCheckout: boolean;
    checkout?: { orderId: string; amount: number; currency: string; key: string };
}>('/payment/create-order', { method: 'POST', body: payload });

/* ----------------------------------------------------------------- OTP --- */

export const requestOtp = (phone: string) =>
    api<{ message: string; smsConfigured: boolean; devCode?: string }>('/otp/request', {
        method: 'POST',
        body: { phone },
        auth: false,
    });

export const verifyOtp = (phone: string, code: string) =>
    api<{ token: string; user: Record<string, unknown>; profileComplete: boolean }>('/otp/verify', {
        method: 'POST',
        body: { phone, code },
        auth: false,
    });

export const saveProfile = (payload: Record<string, unknown>) =>
    api<{ user: Record<string, unknown>; message: string }>('/otp/profile', {
        method: 'PUT',
        body: payload,
    });
