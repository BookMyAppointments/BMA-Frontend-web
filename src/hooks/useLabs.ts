import { useState, useEffect } from 'react';
import { fetchLabs, type Lab } from '../services/api';

export const useLabs = (service?: string) => {
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadLabs = async (selectedService?: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchLabs(selectedService);
            setLabs(data);
        } catch (err) {
            setError('Failed to load labs. Please try again.');
            console.error('Error loading labs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLabs(service);
    }, [service]);

    const refetch = () => loadLabs(service);

    return {
        labs,
        loading,
        error,
        refetch
    };
};

export const useLabById = (labId: string) => {
    const [lab, setLab] = useState<Lab | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLab = async () => {
            try {
                setLoading(true);
                setError(null);
                const labs = await fetchLabs();
                const foundLab = labs.find(l => l.id === labId);
                setLab(foundLab || null);
                if (!foundLab) {
                    setError('Lab not found');
                }
            } catch (err) {
                setError('Failed to load lab details. Please try again.');
                console.error('Error loading lab:', err);
            } finally {
                setLoading(false);
            }
        };

        if (labId) {
            loadLab();
        }
    }, [labId]);

    return {
        lab,
        loading,
        error
    };
};
