import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useService } from '../../context/ServiceContext'
import { useSession } from '../../context/SessionProvider'
import axios from 'axios'
import { API_BASE_URL } from '../../services/api'
import { toast } from 'react-toastify'

type SearchType = 'doctor' | 'hospital' | 'lab';

interface SearchResult {
    id: string;
    name: string;
    type: SearchType;
    specialization?: string;
    location?: string;
}

interface Location {
    lat: number;
    lng: number;
    address: string;
}

const MobileNavbar: FC = () => {
    const { serviceType, toggleService } = useService()
    const { isAuthenticated, logout } = useSession()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const isHomePage = location.pathname === '/'
    const [profilePicture, setProfilePicture] = useState('/profile-placeholder.png')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [userLocation, setUserLocation] = useState<Location | null>(null)
    const [isGettingLocation, setIsGettingLocation] = useState(false)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        // Optional: Call API or update context
        // e.g., updateSearchLocation(e.target.value)
    }

    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = {
                        lat: latitude,
                        lng: longitude,
                        address: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
                    };
                    setUserLocation(location);
                    setSearchQuery(location.address);
                    handleSearch(location.address);
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    toast.error('Failed to get your location');
                    setIsGettingLocation(false);
                }
            );
        } else {
            toast.error('Geolocation is not supported by your browser');
            setIsGettingLocation(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            let endpoint = '';
            const params = new URLSearchParams();

            if (userLocation) {
                params.append('lat', userLocation.lat.toString());
                params.append('lng', userLocation.lng.toString());
                params.append('radius', '10'); // 10km radius
            }

            if (serviceType === 'hospitals') {
                endpoint = `${API_BASE_URL}/search/hospitals?${params.toString()}&location=${encodeURIComponent(query)}`;
            } else {
                endpoint = `${API_BASE_URL}/search/labs?${params.toString()}&location=${encodeURIComponent(query)}`;
            }

            const response = await axios.get(endpoint);

            const results = response.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                type: serviceType === 'hospitals' ? 'hospital' : 'lab',
                location: item.location?.address || item.hospital?.location?.address
            }));
            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to perform search');
        } finally {
            setIsSearching(false);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/${result.type}/${result.id}`);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/auth/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
                if (response.data.profile?.picture) {
                    setProfilePicture(response.data.profile.picture)
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error)
            }
        }

        if (isAuthenticated) {
            fetchUserProfile()
        }
    }, [isAuthenticated])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (isMobileMenuOpen && !target.closest('.mobile-menu-content')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav className="block lg:hidden px-3 py-2 w-full bg-white">
                <div className="flex flex-col gap-3">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between relative">
                        {/* Hamburger */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-gray-600 p-1 z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Centered Logo */}
                        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
                            <img src="/logo.png" alt="Logo" className="h-6" />
                        </Link>

                        {/* Profile / Spacer */}
                        {isAuthenticated ? (
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-6 h-6" /> 
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 w-full">
                            <button
                                onClick={getCurrentLocation}
                                className="text-blue-500 hover:text-blue-600 transition-colors"
                                title="Use my current location"
                            >
                                {isGettingLocation ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 100 4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <input
                                type="text"
                                placeholder={`Search ${serviceType} in your area...`}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    handleSearch(e.target.value);
                                }}
                                onFocus={() => setIsSearchFocused(true)}
                                className="bg-transparent outline-none w-full text-sm text-gray-600 placeholder-gray-400"
                            />
                            {isSearching ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchFocused && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                                {searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleResultClick(result)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex flex-col"
                                    >
                                        <span className="font-medium text-gray-900">{result.name}</span>
                                        {result.location && (
                                            <span className="text-sm text-gray-500">{result.location}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Floating Toggle Buttons */}
            {isHomePage && (
                <div className="fixed bottom-6 right-6 lg:hidden z-30">
                    <div className="flex items-center bg-white rounded-full shadow-sm">
                        <motion.div className="relative flex items-center rounded-full">
                            {/* Hospital Button */}
                            <button
                                onClick={toggleService}
                                className="flex items-center gap-1 px-4 pr-2 py-2 z-10 h-12"
                            >
                                <motion.div 
                                    className={`flex items-center justify-center ${serviceType === 'hospitals' ? 'bg-blue-500' : ''}`}
                                    initial={false}
                                    animate={{
                                        padding: serviceType === 'hospitals' ? 8 : 0,
                                        borderRadius: serviceType === 'hospitals' ? 9999 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <motion.img
                                        src={serviceType === 'hospitals' ? '/icons/hospital-white.png' : '/icons/hospital-gray.png'}
                                        alt="Hospital"
                                        className="w-5 h-5"
                                        animate={{ scale: serviceType === 'hospitals' ? 1.1 : 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                </motion.div>
                                <motion.span 
                                    className="text-gray-600"
                                    initial={false}
                                    animate={{ 
                                        opacity: serviceType !== 'hospitals' ? 1 : 0,
                                        width: serviceType !== 'hospitals' ? 'auto' : 0
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Hospitals
                                </motion.span>
                            </button>

                            {/* Labs Button */}
                            <button
                                onClick={toggleService}
                                className="flex items-center gap-1 px-4 pl-0 py-2 z-10 h-12"
                            >
                                <motion.div 
                                    className={`flex items-center justify-center ${serviceType === 'labs' ? 'bg-blue-500' : ''}`}
                                    initial={false}
                                    animate={{
                                        padding: serviceType === 'labs' ? 8 : 0,
                                        borderRadius: serviceType === 'labs' ? 9999 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    <motion.img
                                        src={serviceType === 'labs' ? '/icons/lab-white.png' : '/icons/lab-gray.png'}
                                        alt="Lab"
                                        className="w-5 h-5"
                                        animate={{ scale: serviceType === 'labs' ? 1.1 : 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                </motion.div>
                                <motion.span 
                                    className="text-gray-600"
                                    initial={false}
                                    animate={{ 
                                        opacity: serviceType !== 'labs' ? 1 : 0,
                                        width: serviceType !== 'labs' ? 'auto' : 0
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Labs
                                </motion.span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Slide-out */}
            {isMobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                >
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mobile-menu-content bg-white w-[80%] max-w-[280px] h-full p-4"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <motion.h2 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg font-semibold text-gray-800"
                            >
                                Menu
                            </motion.h2>
                            <motion.button 
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col space-y-4"
                        >
                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Profile Settings
                                    </Link>
                                    <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Recent Bookings
                                    </Link>
                                    <Link to="/health-records" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        My Health Records
                                    </Link>
                                    <Link to="/help" className="text-gray-700 hover:text-blue-600 transition-colors">
                                        Help & Support
                                    </Link>
                                    <div className="h-px bg-gray-200 my-2" />
                                    <button 
                                        className="text-left text-red-600 hover:text-red-700 transition-colors"
                                        onClick={logout} 
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link to="/signin" className="text-blue-600 font-semibold">
                                    Sign In
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </>
    )
}

export default MobileNavbar