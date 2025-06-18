export interface DoctorFormErrors {
    specialization?: string;
    qualifications?: string;
    price?: string;
    about?: string;
}

export interface DoctorDataRequest {
    specialization: string[];
    qualifications: string[];
    price: number | string;
    about: string;
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
