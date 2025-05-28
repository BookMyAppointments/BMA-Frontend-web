import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import TestBanner from '../../components/TestBanner/TestBanner'
import TestInfo from '../../components/TestDetails/TestInfo'

const TestDetails: FC = () => {
    const { id } = useParams();

    return (
        <div className="min-h-screen flex flex-col">
            <div className="hidden lg:block">
                <Navbar />
            </div>
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            
            <TestBanner testId={id} />
            <TestInfo />
            <Footer />
        </div>
    );
}

export default TestDetails