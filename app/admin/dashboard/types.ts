
export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface Doctor {
    id: string;
    name: string;
    email: string;
    phone: string;
    picture: string;
}

export interface Lab {
    id: string;
    name: string;
    picture: string;
    location: Location;
}

export interface Hospital {
    id: string;
    name: string;
    departments: string[];
    facilities: string[];
    services: string[];
    hours: string;
    location: Location;
    doctors: Doctor[];
    labs: Lab[];
}
