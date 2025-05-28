import type { FC } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import HospitalBanner from '../../components/HospitalBanner/FacilityBanner'
import Categories from '../../components/Categories/Categories'
import DoctorsList from '../../components/DoctorsList/DoctorsList'

const HospitalDetails: FC = () => {

    const hospitalData = {
        name: 'Apollo Super Speciality Hospital',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        metrics: {
            rating: 4.6,
            patientsCount: '1200+',
            doctorsCount: '1200+'
        }
    }

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar/>
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
                        <DoctorsList />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default HospitalDetails