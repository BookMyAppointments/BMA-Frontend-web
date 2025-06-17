
export interface BasicInfoSectionProps {
    formData: HospitalDataRequest;
    setFormData: React.Dispatch<React.SetStateAction<HospitalDataRequest>>;
    errors: HospitalFormErrors;
}

export interface LocationSectionProps {
    formData: HospitalDataRequest;
    setFormData: React.Dispatch<React.SetStateAction<HospitalDataRequest>>;
    errors: HospitalFormErrors;
}

export interface ArraySectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder: string;
    error?: string;
}

export interface HoursSectionProps {
    formData: HospitalDataRequest;
    setFormData: React.Dispatch<React.SetStateAction<HospitalDataRequest>>;
}

export interface HospitalDataRequest {
    name: string;
    location: {
        lat: string | number;
        lng: string | number;
        address: string;
    };
    departments: string[];
    facilities: string[];
    services: string[];
    hours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };
}

export interface HospitalFormErrors {
    name?: string;
    address?: string;
    coordinates?: string;
    departments?: string;
}