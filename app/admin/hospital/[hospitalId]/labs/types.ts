export interface LabFormErrors {
    name?: string;
    address?: string;
    coordinates?: string;
    services?: string;
}
export interface LabDataRequest {
    name: string;
    location: {
        lat: string;
        lng: string;
        address: string;
    };
    services: string[];
}

export interface LabBasicInfoSectionProps {
    formData: LabDataRequest;
    setFormData: React.Dispatch<React.SetStateAction<LabDataRequest>>;
    errors: LabFormErrors;
}

export interface LabLocationSectionProps {
    formData: LabDataRequest;
    setFormData: React.Dispatch<React.SetStateAction<LabDataRequest>>;
    errors: LabFormErrors;
}

export interface LabArraySectionProps {
    title: string;
    icon: React.ReactNode;
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder: string;
    error?: string;
}