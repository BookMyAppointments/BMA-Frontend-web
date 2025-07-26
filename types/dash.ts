export interface FacilityBannerProps {
    name: string;
    description: string;
    bannerImage?: string;
    metrics: {
        rating: number;
        patientsCount: string;
        doctorsCount: string;
        testsCount?: string;
    };
}
