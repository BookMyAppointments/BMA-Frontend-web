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

function App() {
    return (
        <ServiceProvider>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/hospital/:id" element={<HospitalDetails />} />
                        <Route path="/lab/:id" element={<LabDetails />} />
                        <Route path="/doctor/:id" element={<DoctorDetails />} />
                        <Route path="/test/:id" element={<TestDetails />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                        <Route path="/bookings" element={<RecentBookings />} />
                        <Route path="/health-records" element={<HealthRecords />} />
                        <Route path="/test-booking" element={<TestBooking />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </ServiceProvider>
    )
}

export default App
