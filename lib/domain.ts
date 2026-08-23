import {
    Activity, Baby, Bone, Brain, Ear, Eye, HeartPulse, Microscope,
    Stethoscope, Wind, Droplets, Syringe, ShieldPlus, Scan, User, Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Specialties shown on the home screen. `key` must match Doctor.specialization. */
export interface Specialty {
    key: string;
    label: string;
    blurb: string;
    icon: LucideIcon;
}

export const SPECIALTIES: Specialty[] = [
    { key: 'Cardiology', label: 'Heart', blurb: 'Chest pain, BP, heart care', icon: HeartPulse },
    { key: 'Orthopedics', label: 'Bones & Joints', blurb: 'Fractures, back and knee pain', icon: Bone },
    { key: 'Dermatology', label: 'Skin & Hair', blurb: 'Rashes, acne, hair loss', icon: Droplets },
    { key: 'Pediatrics', label: 'Child Care', blurb: 'Newborn to teenage care', icon: Baby },
    { key: 'Neurology', label: 'Brain & Nerves', blurb: 'Headache, seizures, stroke', icon: Brain },
    { key: 'Gynecology', label: "Women's Health", blurb: 'Pregnancy and womens care', icon: ShieldPlus },
    { key: 'ENT', label: 'Ear, Nose & Throat', blurb: 'Ear pain, sinus, tonsils', icon: Ear },
    { key: 'Ophthalmology', label: 'Eye Care', blurb: 'Vision, cataract, eye pain', icon: Eye },
    { key: 'Gastroenterology', label: 'Stomach', blurb: 'Acidity, digestion, liver', icon: Activity },
    { key: 'Pulmonology', label: 'Lungs', blurb: 'Cough, asthma, breathing', icon: Wind },
    { key: 'Urology', label: 'Kidney & Urinary', blurb: 'Stones, urinary problems', icon: Microscope },
    { key: 'Psychiatry', label: 'Mental Health', blurb: 'Anxiety, sleep, depression', icon: Brain },
    { key: 'Endocrinology', label: 'Diabetes & Hormones', blurb: 'Sugar, thyroid, hormones', icon: Syringe },
    { key: 'Nephrology', label: 'Kidney', blurb: 'Kidney disease and dialysis', icon: Activity },
    { key: 'Oncology', label: 'Cancer Care', blurb: 'Screening and treatment', icon: ShieldPlus },
    { key: 'Radiology', label: 'Scans & Imaging', blurb: 'X-ray, CT, MRI', icon: Scan },
    { key: 'Rheumatology', label: 'Arthritis', blurb: 'Joint pain and swelling', icon: Bone },
    { key: 'Anesthesiology', label: 'Anaesthesia', blurb: 'Surgery and pain relief', icon: Stethoscope },
];

export const findSpecialty = (key: string) =>
    SPECIALTIES.find((s) => s.key.toLowerCase() === key.toLowerCase());

/** Who the appointment is for. Maps to Doctor.treats on the backend. */
export const PATIENT_TYPES = [
    { key: 'MEN', label: 'Men', icon: User },
    { key: 'WOMEN', label: 'Women', icon: Users },
    { key: 'CHILDREN', label: 'Children', icon: Baby },
] as const;

export type PatientTypeKey = (typeof PATIENT_TYPES)[number]['key'];

/** Stored as an enum on the backend; these are the display labels. */
export const BLOOD_GROUPS = [
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A−' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B−' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB−' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O−' },
] as const;

export const bloodGroupLabel = (value?: string | null) =>
    BLOOD_GROUPS.find((b) => b.value === value)?.label ?? null;

export const LAB_SERVICES = [
    'Blood Tests', 'Urine Tests', 'X-Ray', 'Ultrasound', 'ECG',
    'CT Scan', 'MRI', 'Pathology', 'Hematology', 'Biochemistry',
];

/* --------------------------------------------------------------- format -- */

export const rupees = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);

export const ageFromDob = (dob?: string | Date | null): number | null => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (Number.isNaN(birth.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
    return age >= 0 && age < 130 ? age : null;
};

export const formatDay = (date: Date) =>
    new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);

export const formatTime = (date: Date) =>
    new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);

export const formatDateTime = (date: Date) => `${formatDay(date)}, ${formatTime(date)}`;

/** Straight-line km between two points. Used to sort "near me" results. */
export const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
