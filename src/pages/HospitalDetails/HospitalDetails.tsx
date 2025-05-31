import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNavbar from '../../components/Navbar/MobileNavbar';
import Footer from '../../components/Footer/Footer';
import HospitalBanner from '../../components/HospitalBanner/FacilityBanner';
import Categories from '../../components/Categories/Categories';
import DoctorsList from '../../components/DoctorsList/DoctorsList';

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
  const [hospitalData, setHospitalData] = useState({
    name: '',
    description: '',
    metrics: {
      rating: 0,
      patientsCount: '',
      doctorsCount: ''
    }
  });

  useEffect(() => {
    console.log('HospitalDetails component mounted');
    console.log('hospitalId from params:', hospitalId);
    
    const fetchHospitalData = async () => {
      try {
        console.log('Fetching hospital data for ID:', hospitalId);
        const url = `${import.meta.env.VITE_BACKEND_URL}/hospitals/get/${hospitalId}`;
        console.log('Request URL:', url);
        
        const res = await fetch(url);
        console.log('Response status:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Hospital data:', data);

        const doctorsMapped = data.doctors.map((doc: any) => ({
          id: doc.doctor.id,
          name: doc.doctor.user.name,
          image: '/doctors/doctor1.jpg',
          qualification: doc.doctor.qualifications.join(', '),
          specialization: doc.doctor.specialization.join(', '),
          rating: doc.doctor.ratings,
          patientsCount: doc.doctor.reviews.length.toString() + '+'
        }));

        setDoctors(doctorsMapped);
        setHospitalData({
          name: data.name,
          description: data?.description || 'No description available.',
          metrics: {
            rating: 4.5, // Hardcoded or derived if needed
            patientsCount: '1500+',
            doctorsCount: `${doctorsMapped.length}+`
          }
        });
      } catch (err) {
        console.error('Failed to fetch hospital data:', err);
        console.error('Error details:', err);
      }
    };

    if (hospitalId) {
      console.log('hospitalId exists, fetching data...');
      fetchHospitalData();
    } else {
      console.log('No hospitalId found in URL params');
    }
  }, [hospitalId]);

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
            <Categories />
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
