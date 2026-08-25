import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconUsers, IconCalendar, IconBadge, IconX } from '../components/Icons';

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // fetch summary data
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/reports/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Failed to load summary');
                    return;
                }
                setSummary(data);
            } catch (err) {
                setError('Could not connect to server');
            }
        };
        fetchSummary();
    }, []);

    // handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="page">
            <div className="hero-band">
                <h1>Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
                <p>Here's what's happening across visitors, appointments and passes today.</p>
            </div>

            {/* {error && <div className="alert alert-error"><IconX size={15} /> {error}</div>} */}

            {summary && (
                <div className="stat-grid">
                    <div className="stat-card">
                        <span className="stat-icon blue"><IconUsers size={22} /></span>
                        <div>
                            <div className="stat-value">{summary.totalVisitors}</div>
                            <div className="stat-label">Total Visitors</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon amber"><IconCalendar size={22} /></span>
                        <div>
                            <div className="stat-value">{summary.totalAppointments}</div>
                            <div className="stat-label">Total Appointments</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon green"><IconBadge size={22} /></span>
                        <div>
                            <div className="stat-value">{summary.totalPasses}</div>
                            <div className="stat-label">Total Passes</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
