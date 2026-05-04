import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Visitors from './pages/Visitors';
import Appointments from './pages/Appointment';
import Passes from './pages/Passes';
import QRScanner from './pages/QRScanner';
import Reports from './pages/Reports';
import MyPasses from './pages/MyPasses';


function App() {
    const { user } = useAuthContext();

    return (
        <BrowserRouter>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />                
                <Route path="/visitors" element={user ? <Visitors /> : <Navigate to="/login" />} />
                <Route path="/appointments" element={user ? <Appointments /> : <Navigate to="/login" />} />
                <Route path="/passes" element={user ? <Passes /> : <Navigate to="/login" />} />
                <Route path="/qr-scanner" element={user ? <QRScanner /> : <Navigate to="/login" />} />
                <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
                <Route path="/my-passes" element={user ? <MyPasses /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/login" />} />
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;