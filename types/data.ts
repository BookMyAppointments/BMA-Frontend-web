export type SearchType = 'doctor' | 'hospital' | 'lab';

export interface SearchResult {
    id: string;
    name: string;
    type: SearchType;
    specialization?: string;
    location?: string;
}

// Re-export Location from the main schema
export type { Location } from './doctor';