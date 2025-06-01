import type { FC } from 'react'
import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import MobileNavbar from '../../components/Navbar/MobileNavbar'
import Banner from '../../components/Banner/Banner'
import Categories from '../../components/Categories/Categories'
import HospitalList from '../../components/HospitalList/HospitalList'
import Footer from '../../components/Footer/Footer'

const Home: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Cardiology');

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <div className="block lg:hidden sticky top-0 z-30 bg-white">
                <MobileNavbar />
            </div>
            <div className="hidden lg:block">
                <Navbar />
            </div>
            
            <main className="flex-1 w-full">
                <div className="space-y-3 lg:space-y-4">
                    <div className="lg:hidden">
                        <Categories 
                            onCategoryChange={handleCategoryChange}
                            initialCategory={selectedCategory}
                        />
                        <Banner />
                    </div>
                    <div className="hidden lg:block">
                        <Banner />
                        <Categories 
                            onCategoryChange={handleCategoryChange}
                            initialCategory={selectedCategory}
                        />
                    </div>
                    <HospitalList selectedCategory={selectedCategory} />
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Home