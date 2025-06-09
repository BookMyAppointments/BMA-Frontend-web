import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import HospitalDetails from './pages/HospitalDetails/HospitalDetails'
import DoctorDetails from './pages/DoctorDetails/DoctorDetails'
import TestDetails from './pages/TestDetails/TestDetails'
import Booking from './pages/Booking/Booking'
import ProfileSettings from './pages/ProfileSettings/ProfileSettings'
import RecentBookings from './pages/RecentBookings/RecentBookings'
import HealthRecords from './pages/HealthRecords/HealthRecords'
import { ServiceProvider } from './context/ServiceContext'
import LabDetails from './pages/LabDetails/LabDetails'
import TestBooking from './pages/TestBooking/TestBooking'
import SignUp from './components/Auth/SignUp'
import SignIn from './components/Auth/SignIn'
import Verify from './components/Auth/Verify'
import { SessionProvider } from './context/SessionProvider'
import ForgotPassword from './components/Auth/ForgotPassword'
import Support from './pages/HelpSupport/Support'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Emergency from './pages/Emergency/Emergency'
import EmergencyBooking from './pages/EmergencyBooking/EmergencyBooking'

function App() {
    const client=new QueryClient()
    return (
        <QueryClientProvider client={client}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <SessionProvider>
                <ServiceProvider>
                    <BrowserRouter>
                        <div className="App">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/emergency" element={<Emergency />} />
                                <Route path="/emergency-booking/:hospitalId" element={<EmergencyBooking />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/verify" element={<Verify />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                                <Route path="/hospital/:id" element={<HospitalDetails />} />
                                <Route path="/labs" element={<LabDetails />} />
                                <Route path="/lab/:id" element={<LabDetails />} />
                                <Route path="/doctor/:id" element={<DoctorDetails />} />
                                <Route path="/test/:id" element={<TestDetails />} />
                                <Route path="/booking" element={<Booking />} />
                                <Route path="/profile" element={<ProfileSettings />} />
                                <Route path="/bookings" element={<RecentBookings />} />
                                <Route path="/health-records" element={<HealthRecords />} />
                                <Route path="/test-booking" element={<TestBooking />} />
                                <Route path='/help' element={<Support />} />
                            </Routes>
                        </div>
                    </BrowserRouter>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </ServiceProvider>
            </SessionProvider>
        </GoogleOAuthProvider>
        </QueryClientProvider>
    )
}

export default App
