import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import MobileNavbar from '../../components/Navbar/MobileNavbar';
import Footer from '../../components/Footer/Footer';
import { DoctorBanner } from '../../components/DoctorBanner/DoctorBanner';
import DoctorInfo from '../../components/DoctorDetails/DoctorInfo';

const DoctorDetails: FC = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchDoctor = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/v1/doctors/get/${id}`);
                const data = await res.json();
                setDoctor(data);
            } catch (err) {
                console.error('Error fetching doctor data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (!doctor) return <div className="text-center mt-10">Doctor not found</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            <DoctorBanner doctor={doctor} />
            <DoctorInfo doctor={doctor} />
            <Footer />
        </div>
    );
};

export default DoctorDetails;
