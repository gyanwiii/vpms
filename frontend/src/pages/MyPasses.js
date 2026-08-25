import { useState, useEffect } from 'react';
import { IconArrowLeft, IconBadge, IconX } from '../components/Icons';

// my passes page component
export default function MyPasses() {
    const [passes, setPasses] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchMyPasses = async () => {
            try {
                const res = await fetch('https://visitor-pass-management-9jme.onrender.com/api/passes', {
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
        <div className="page">
            <a href="/dashboard" className="back-link"><IconArrowLeft size={14} /> Back to Dashboard</a>

            <div className="page-header">
                <div>
                    <h1>My Passes</h1>
                    <p className="page-subtitle">Your issued access passes and their status</p>
                </div>
            </div>


            {passes.length === 0 ? (
                <div className="empty-state">
                    <IconBadge size={26} style={{ marginBottom: '8px', color: 'var(--text-faint)' }} />
                    <div>You don't have any passes yet.</div>
                </div>
            ) : (
                <ul className="list">
                    {passes.map(pass => (
                        <li key={pass._id} className="pass-card">
                            <span className={`pass-stripe badge-${pass.status}`} />
                            <div className="pass-main">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <span className="pass-no">{pass.passNo}</span>
                                    <span className={`badge badge-${pass.status}`}>{pass.status}</span>
                                </div>
                            </div>
                            {pass.qrCode && (
                                <div className="pass-qr-wrap">
                                    <img src={pass.qrCode} alt="QR Code" />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
