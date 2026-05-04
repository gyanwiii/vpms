import { useState, useEffect } from 'react';

// my passes page component
export default function MyPasses() {
    const [passes, setPasses] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMyPasses = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/passes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message || 'Failed to load passes');
                    return;
                }
                setPasses(data);
            } catch (err) {
                setError('Could not connect to server');
            }
        };
        fetchMyPasses();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <a href="/dashboard">← Back to Dashboard</a>
            <h2>My Passes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {passes.map(pass => (
                    <li key={pass._id}>
                        {pass.passNo} - {pass.status}
                        {pass.qrCode && (
                            <img src={pass.qrCode} alt="QR Code" style={{ width: '100px', height: '100px', display: 'block' }} />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}