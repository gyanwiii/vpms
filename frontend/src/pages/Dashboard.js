import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ padding: '20px' }}>
            {summary && (
                <div>
                    <h3>Summary</h3>
                    <p>Total Visitors: {summary.totalVisitors}</p>
                    <p>Total Appointments: {summary.totalAppointments}</p>
                    <p>Total Passes: {summary.totalPasses}</p>
                </div>
            )}
        </div>
    );
}