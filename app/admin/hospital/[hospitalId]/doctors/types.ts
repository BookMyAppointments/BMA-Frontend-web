export interface DoctorFormErrors {
    name?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    qualifications?: string;
    price?: string;
    about?: string;
    availability?: string;
}

export interface AvailabilitySlot {
    day: string;
    startTime: string;
    endTime: string;
}

export interface DoctorDataRequest {
    name: string;
    email: string;
    phone: string;
    specialization: string[];
    qualifications: string[];
    price: number | string;
    about: string;
    availability: AvailabilitySlot[];
}

export interface DoctorBasicInfoSectionProps {
    formData: DoctorDataRequest;
    setFormData: React.Dispatch<React.SetStateAction<DoctorDataRequest>>;
    errors: DoctorFormErrors;
}

export interface DoctorArraySectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder: string;
    error?: string;
}

export interface SearchUser {
    id: string;
    name: string;
    email: string;
}
