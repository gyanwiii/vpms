import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    return (
        <nav style={{background: '#333',padding: '10px 20px',display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
            <div>
                <a href="/dashboard" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Dashboard</a>
                {(user?.role === 'admin' || user?.role === 'security' || user?.role === 'employee') && (
                    <a href="/visitors" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Visitors</a>
                )}
                <a href="/appointments" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Appointments</a>
                {(user?.role === 'admin' || user?.role === 'security') && (
                    <>
                        <a href="/passes" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Passes</a>
                        <a href="/qr-scanner" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>QR Scanner</a>
                        <a href="/reports" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Reports</a>
                    </>
                )}
                {user?.role === 'visitor' && (
                    <a href="/my-passes" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>My Passes</a>
                )}
            </div>
            <div>
                <span style={{ color: 'white', marginRight: '10px' }}>{user?.name} ({user?.role})</span>
                <button onClick={logout} style={{ padding: '5px 10px' }}>Logout</button>
            </div>
        </nav>
    );
}