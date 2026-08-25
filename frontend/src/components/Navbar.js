import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { IconGrid, IconUsers, IconCalendar, IconBadge, IconScan, IconChart, IconLogout } from './Icons';

export default function Navbar() {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const initials = (user?.name || '?').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

    return (
        <nav className="navbar">
            <div className="nav-left">
                <div className="brand">
                    <span className="brand-mark"><IconBadge size={16} color="#fff" /></span>
                    Gatepass
                </div>
                <div className="nav-links">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        <IconGrid size={16} /> Dashboard
                    </NavLink>
                    {(user?.role === 'admin' || user?.role === 'security' || user?.role === 'employee') && (
                        <NavLink to="/visitors" className={({ isActive }) => isActive ? 'active' : ''}>
                            <IconUsers size={16} /> Visitors
                        </NavLink>
                    )}
                    <NavLink to="/appointments" className={({ isActive }) => isActive ? 'active' : ''}>
                        <IconCalendar size={16} /> Appointments
                    </NavLink>
                    {(user?.role === 'admin' || user?.role === 'security') && (
                        <>
                            <NavLink to="/passes" className={({ isActive }) => isActive ? 'active' : ''}>
                                <IconBadge size={16} /> Passes
                            </NavLink>
                            <NavLink to="/qr-scanner" className={({ isActive }) => isActive ? 'active' : ''}>
                                <IconScan size={16} /> QR Scanner
                            </NavLink>
                            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                                <IconChart size={16} /> Reports
                            </NavLink>
                        </>
                    )}
                    {user?.role === 'visitor' && (
                        <NavLink to="/my-passes" className={({ isActive }) => isActive ? 'active' : ''}>
                            <IconBadge size={16} /> My Passes
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="nav-right">
                <div className="user-chip">
                    <span className="user-avatar">{initials}</span>
                    <span>
                        {user?.name}
                        <span className="user-role"> · {user?.role}</span>
                    </span>
                </div>
                <button className="btn btn-ghost btn-sm icon-btn" onClick={logout} title="Logout">
                    <IconLogout size={16} />
                </button>
            </div>
        </nav>
    );
}
