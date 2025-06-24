export interface LabFormErrors {
    name?: string;
    address?: string;
    coordinates?: string;
    services?: string;
    description?: string;
    hours?: string;
}

export interface OperatingHours {
    day: string;
    startTime: string;
    endTime: string;
}

export interface LabDataRequest {
    name: string;
    description?: string;
    location: {
        lat: string | number;
        lng: string | number;
        address: string;
    };
    services: string[];
    hours?: OperatingHours[];
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