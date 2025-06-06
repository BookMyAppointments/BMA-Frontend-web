import type { FC } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../components/Navbar/Navbar';
import MobileNavbar from '../../components/Navbar/MobileNavbar';
import Footer from '../../components/Footer/Footer';
import HospitalBanner from '../../components/HospitalBanner/FacilityBanner';
import Categories from '../../components/Categories/Categories';
import DoctorsList from '../../components/DoctorsList/DoctorsList';
import { API_BASE_URL, fetchDoctorsBySpecialization, type Doctor } from '../../services/api';

export interface DoctorData {
  id: string;
  name: string;
  image: string;
  qualification: string;
  specialization: string;
  rating: number;
  patientsCount: string;
}

const HospitalDetails: FC = () => {
  const { id } = useParams();
  const hospitalId = id || '';
  const [selectedCategory, setSelectedCategory] = useState<string>('Cardiology');

  // Query for hospital data
  const { data: hospitalData, isLoading: isHospitalLoading, error: hospitalError } = useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/hospitals/get/${hospitalId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      return {
        name: data.name,
        description: data?.description || 'No description available.',
        metrics: {
          rating: 4.5,
          patientsCount: '1500+',
          doctorsCount: `${data.doctors.length}+`
        }
      };
    },
    enabled: !!hospitalId
  });

  // Query for doctors data
  const { data: doctors = [], isLoading: isDoctorsLoading, error: doctorsError } = useQuery({
    queryKey: ['doctors', selectedCategory, hospitalId],
    queryFn: async () => {
      const data = await fetchDoctorsBySpecialization(selectedCategory);
      const hospitalDoctors = data.filter(doc => doc.hospitalId === hospitalId);
      
      return hospitalDoctors.map(doc => ({
        id: doc.doctor.id,
        name: doc.doctor.user.name,
        image: '/doctors/doctor1.jpg',
        qualification: doc.doctor.qualifications.join(', '),
        specialization: doc.doctor.specialization.join(', '),
        rating: doc.doctor.ratings,
        patientsCount: (doc.doctor as Doctor).noOfPatients + '+'
      }));
    },
    enabled: !!hospitalId && !!selectedCategory
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const isLoading = isHospitalLoading || isDoctorsLoading;
  const error = hospitalError || doctorsError;

  if (isLoading) {
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
        <div className="block lg:hidden sticky top-0 z-30 bg-white">
          <MobileNavbar />
        </div>
        <div className="hidden lg:block">
          <Navbar />
        </div>
        
        <main className="flex-1 w-full">
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <p className="text-gray-600">{error instanceof Error ? error.message : 'Something went wrong'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
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
        {hospitalData && <HospitalBanner {...hospitalData} />}
        <div className="">
          <div className="">
            <Categories 
              onCategoryChange={handleCategoryChange}
              initialCategory={selectedCategory}
            />
          </div>
          <div className="">
            <DoctorsList doctors={doctors} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HospitalDetails;
