import type { FC } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import HealthRecordsList from '../../components/HealthRecordsList/HealthRecordsList'

const HealthRecords: FC = () => {

    return (
        <div className="min-h-screen flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar 
                />
            </div>
            <main className="flex-1 w-full">
                <HealthRecordsList />
            </main>
            <Footer />
        </div>
    );
}

export default HealthRecords