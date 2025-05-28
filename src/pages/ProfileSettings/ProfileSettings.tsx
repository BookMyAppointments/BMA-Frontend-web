import type { FC } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Footer from '../../components/Footer/Footer'
import ProfileForm from '../../components/ProfileForm/ProfileForm'

const ProfileSettings: FC = () => {

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
            <ProfileForm />
            </main>
            <Footer />
        </div>
    );
}

export default ProfileSettings