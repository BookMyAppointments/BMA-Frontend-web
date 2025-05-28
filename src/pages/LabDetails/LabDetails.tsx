import type { FC } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import FacilityBanner from '../../components/HospitalBanner/FacilityBanner'
import Categories from '../../components/Categories/Categories'
import TestsList from '../../components/TestsList/TestsList'

const LabDetails: FC = () => {
    const labData = {
        name: 'LifeCare Diagnostics',
        description: 'Advanced diagnostic center equipped with state-of-the-art technology and experienced pathologists. We provide accurate and timely test results with a focus on quality and patient care.',
        metrics: {
            rating: 4.8,
            patientsCount: '5000+',
            doctorsCount: '25+',
            testsCount: '100+'
        }
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
                        <Categories />
                    </div>

                    <div className="">
                        <TestsList />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default LabDetails