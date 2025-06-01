import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNavbar from '../../components/Navbar/MobileNavbar';
import Footer from '../../components/Footer/Footer';
import HospitalBanner from '../../components/HospitalBanner/FacilityBanner';
import Categories from '../../components/Categories/Categories';
import DoctorsList from '../../components/DoctorsList/DoctorsList';
import { API_BASE_URL, fetchDoctorsBySpecialization } from '../../services/api';

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
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Cardiology');
  const [hospitalData, setHospitalData] = useState({
    name: '',
    description: '',
    metrics: {
      rating: 0,
      patientsCount: '',
      doctorsCount: ''
    }
  });

  const fetchDoctors = async (specialization: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDoctorsBySpecialization(specialization);
      
      // Filter doctors for this hospital
      const hospitalDoctors = data.filter(doc => doc.hospitalId === hospitalId);
      
      const doctorsMapped = hospitalDoctors.map(doc => ({
        id: doc.doctor.id,
        name: doc.doctor.user.name,
        image: '/doctors/doctor1.jpg',
        qualification: doc.doctor.qualifications.join(', '),
        specialization: doc.doctor.specialization.join(', '),
        rating: doc.doctor.ratings,
        patientsCount: doc.doctor.reviews.length.toString() + '+'
      }));

      setDoctors(doctorsMapped);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('HospitalDetails component mounted');
    console.log('hospitalId from params:', hospitalId);
    
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching hospital data for ID:', hospitalId);
        const url = `${API_BASE_URL}/hospitals/get/${hospitalId}`;
        console.log('Request URL:', url);
        
        const res = await fetch(url);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Hospital data:', data);

        setHospitalData({
          name: data.name,
          description: data?.description || 'No description available.',
          metrics: {
            rating: 4.5, // Hardcoded or derived if needed
            patientsCount: '1500+',
            doctorsCount: `${data.doctors.length}+`
          }
        });

        // Fetch initial doctors for the selected category
        await fetchDoctors(selectedCategory);
      } catch (err) {
        console.error('Failed to fetch hospital data:', err);
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hospital data');
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      console.log('hospitalId exists, fetching data...');
      fetchHospitalData();
    } else {
      console.log('No hospitalId found in URL params');
      setLoading(false);
    }
  }, [hospitalId]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchDoctors(category);
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
            <p className="text-gray-600">{error}</p>
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
        <HospitalBanner {...hospitalData} />
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
