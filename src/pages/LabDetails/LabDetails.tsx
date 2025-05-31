import type { FC } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import FacilityBanner from '../../components/HospitalBanner/FacilityBanner'
import Categories from '../../components/Categories/Categories'
import LabsList from '../../components/LabsList/LabsList'
import { useLabById } from '../../hooks/useLabs'

const LabDetails: FC = () => {
    const { labId } = useParams<{ labId?: string }>();
    const [selectedService, setSelectedService] = useState<string>('Blood Test');
    const { lab: selectedLab, loading } = useLabById(labId || '');

    const handleCategoryChange = (category: string) => {
        setSelectedService(category);
    };

    // Use specific lab data if available, otherwise use default
    const labData = selectedLab ? {
        name: selectedLab.name,
        description: `${selectedLab.name} is part of ${selectedLab.hospital.name}. Located at ${selectedLab.location.address}, we provide comprehensive diagnostic services with state-of-the-art technology and experienced technicians.`,
        metrics: {
            rating: 4.8,
            patientsCount: '5000+',
            doctorsCount: '25+',
            testsCount: selectedLab.services.length.toString() + '+'
        }
    } : {
        name: 'LifeCare Diagnostics',
        description: 'Advanced diagnostic center equipped with state-of-the-art technology and experienced pathologists. We provide accurate and timely test results with a focus on quality and patient care.',
        metrics: {
            rating: 4.8,
            patientsCount: '5000+',
            doctorsCount: '25+',
            testsCount: '100+'
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
                <div className="block lg:hidden sticky top-0 z-30 bg-white">
                    <MobileNavbar />
                </div>
                <div className="hidden lg:block">
                    <Navbar />
                </div>
                
                <main className="flex-1 w-full">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 mx-6 rounded-xl mb-6"></div>
                        <div className="p-6">
                            <div className="h-20 bg-gray-200 rounded mb-4"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-40 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            <div className="hidden lg:block">
                <Navbar />
            </div>
            
            <main className="flex-1 w-full">
                <FacilityBanner {...labData} />

                <div className="">
                    <div className="">
                        <Categories onCategoryChange={handleCategoryChange} />
                    </div>

                    <div className="">
                        <LabsList selectedService={selectedService} />
                    </div>
                </div>
            </main>            <Footer />
        </div>
    )
}

export default LabDetails