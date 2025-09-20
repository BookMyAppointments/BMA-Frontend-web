'use client';
import { useState, type FC } from 'react';
import Categories from '../dash/hospital/Categories';
import LabCategories from '../dash/labs/LabCategories';
import HospitalList from '../dash/hospital/HospitalList';
import Banner from '../layout/Banner';
import { useService } from '@/context/serviceProvider';
import LabsList from '../dash/labs/LabsList';

const Home: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Cardiology');
    const [selectedService, setSelectedService] = useState<string>('Blood Test');
    const { serviceType } = useService();
    
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };
    
    const handleServiceChange = (service: string) => {
        setSelectedService(service);
    };

    return (
        <main className="flex-1 w-full">
            <div className="space-y-3 lg:space-y-4">
                <div className="lg:hidden">
                    {serviceType === 'hospitals' ? (
                        <Categories
                            onCategoryChange={handleCategoryChange}
                            initialCategory={selectedCategory}
                        />
                    ) : (
                        <LabCategories
                            onServiceChange={handleServiceChange}
                            initialService={selectedService}
                        />
                    )}
                    <Banner />
                </div>
                <div className="hidden lg:block">
                    <Banner />
                    {serviceType === 'hospitals' ? (
                        <Categories
                            onCategoryChange={handleCategoryChange}
                            initialCategory={selectedCategory}
                        />
                    ) : (
                        <LabCategories
                            onServiceChange={handleServiceChange}
                            initialService={selectedService}
                        />
                    )}
                </div>
                {serviceType === 'hospitals' ? (
                    <HospitalList selectedCategory={selectedCategory} />
                ) : (
                    <LabsList selectedService={selectedService} />
                )}
            </div>
        </main>
    );
};

export default Home;