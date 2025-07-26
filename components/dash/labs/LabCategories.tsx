'use client';
import type { FC } from 'react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface LabService {
    id: string;
    name: string;
    icon: string;
    description: string;
}

interface LabCategoriesProps {
    onServiceChange: (service: string) => void;
    initialService: string;
}

const LabCategories: FC<LabCategoriesProps> = ({ onServiceChange, initialService }) => {
    const [selectedService, setSelectedService] = useState<string>(initialService || 'Blood Test');
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY * 2;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            el.removeEventListener('wheel', onWheel);
        };
    }, []);

    useEffect(() => {
        setSelectedService(initialService || 'Blood Test');
    }, [initialService]);

    const handleServiceSelect = (serviceId: string) => {
        setSelectedService(serviceId);
        if (onServiceChange) {
            onServiceChange(serviceId);
        }
    };

    const labServices: LabService[] = [
        {
            id: 'Blood Test',
            name: 'Blood Tests',
            icon: '/icons/cat.png',
            description: 'Complete Blood Analysis'
        },
        {
            id: 'Urine Test',
            name: 'Urine Tests',
            icon: '/icons/cat.png',
            description: 'Urine Analysis & Testing'
        },
        {
            id: 'X-Ray',
            name: 'X-Ray',
            icon: '/icons/cat.png',
            description: 'X-Ray Imaging Services'
        },
        {
            id: 'MRI Scan',
            name: 'MRI Scan',
            icon: '/icons/cat.png',
            description: 'Magnetic Resonance Imaging'
        },
        {
            id: 'CT Scan',
            name: 'CT Scan',
            icon: '/icons/cat.png',
            description: 'Computed Tomography'
        },
        {
            id: 'Ultrasound',
            name: 'Ultrasound',
            icon: '/icons/cat.png',
            description: 'Ultrasound Imaging'
        },
        {
            id: 'ECG',
            name: 'ECG',
            icon: '/icons/cat.png',
            description: 'Electrocardiogram'
        },
        {
            id: 'Pathology',
            name: 'Pathology',
            icon: '/icons/cat.png',
            description: 'Pathological Testing'
        },
        {
            id: 'Radiology',
            name: 'Radiology',
            icon: '/icons/cat.png',
            description: 'Radiological Services'
        },
        {
            id: 'Microbiology',
            name: 'Microbiology',
            icon: '/icons/cat.png',
            description: 'Microbiological Testing'
        }
    ];

    return (
        <div className="w-full py-1.5 px-2 lg:py-3 lg:px-6">
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-1.5 lg:gap-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth pb-1"
            >
                {labServices.map((service) => (
                    <div
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className={`flex items-center gap-1.5 lg:gap-2 p-1.5 lg:p-2 rounded-md lg:rounded-xl transition-all cursor-pointer shrink-0 w-[140px] lg:w-[200px]
                            ${selectedService === service.id
                                ? 'bg-[#0066FF] text-white'
                                : 'bg-[#F8F8F8] hover:bg-gray-100'
                            }`}
                    >
                        <div className={`w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center rounded-full p-1 lg:p-1.5
                            ${selectedService === service.id ? 'bg-white/20' : 'bg-white'}`}>
                            <Image
                                width={24}
                                height={24}
                                unoptimized
                                src={service.icon}
                                alt={service.name}
                                className={`w-2.5 h-2.5 lg:w-4 lg:h-4 object-contain ${selectedService === service.id ? 'brightness-0 invert' : ''}`}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={`text-xs lg:text-sm font-medium truncate ${selectedService === service.id ? 'text-white' : 'text-gray-800'}`}>
                                {service.name}
                            </h3>
                            <p className={`text-[8px] lg:text-[10px] truncate ${selectedService === service.id ? 'text-white/80' : 'text-gray-500'}`}>
                                {service.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LabCategories;