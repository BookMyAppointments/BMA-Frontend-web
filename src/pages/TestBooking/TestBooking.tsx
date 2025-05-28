import type { FC } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import TestBookingForm from '../../components/TestBookingForm/TestBookingForm'

const TestBooking: FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            
            <TestBookingForm />
            <Footer />
        </div>
    )
}

export default TestBooking