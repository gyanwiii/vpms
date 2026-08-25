import { useState, useEffect } from "react";
import { IconArrowLeft, IconBadge, IconX } from '../components/Icons';

//passes management
export default function Passes() {
    const [passes, setPasses] = useState([]);
    const [visitorId, setVisitorId] = useState('');
    const [validDate, setValidDate] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPasses();
    }, []);

    // fetch all passes from backend
    const fetchPasses = async () => {
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

    // create new pass
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://visitor-pass-management-9jme.onrender.com/api/passes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ visitorId, validDate })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to create pass');
                return;
            }
            setVisitorId('');
            setValidDate('');
            fetchPasses();
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    // check-in pass
    const handleCheckin = async (id) => {
        await fetch(`https://visitor-pass-management-9jme.onrender.com/api/passes/${id}/checkin`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPasses();
    };

    // check-out pass
    const handleCheckout = async (id) => {
        await fetch(`https://visitor-pass-management-9jme.onrender.com/api/passes/${id}/checkout`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPasses();
    };

    // revoke pass (admin only)
    const handleRevoke = async (id) => {
        await fetch(`https://visitor-pass-management-9jme.onrender.com/api/passes/${id}/revoke`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPasses();
    };

    return (
        <div className="page">
            <a href="/dashboard" className="back-link"><IconArrowLeft size={14} /> Back to Dashboard</a>

            <div className="page-header">
                <div>
                    <h1>Passes</h1>
                    <p className="page-subtitle">Issue access passes and track check-ins</p>
                </div>
            </div>

            <div className="panel">
                <div className="section-title">Issue New Pass</div>
                <form onSubmit={handleCreate}>
                    <div className="field-grid">
                        <div className="field">
                            <label>Visitor ID</label>
                            <input placeholder="Visitor ID" value={visitorId} onChange={e => setVisitorId(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Valid Until</label>
                            <input type="datetime-local" value={validDate} onChange={e => setValidDate(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Issue Pass</button>
                    </div>
                </form>
            </div>

            <div className="section-title">
                All Passes <span className="count">({passes.length})</span>
            </div>

            {passes.length === 0 ? (
                <div className="empty-state">
                    <IconBadge size={26} style={{ marginBottom: '8px', color: 'var(--text-faint)' }} />
                    <div>No passes issued yet.</div>
                </div>
            ) : (
                <ul className="list">
                    {passes.map((pass) => (
                        <li key={pass._id} className="pass-card">
                            <span className={`pass-stripe badge-${pass.status}`} />
                            <div className="pass-main">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <span className="pass-no">{pass.passNo}</span>
                                    <span className={`badge badge-${pass.status}`}>{pass.status}</span>
                                </div>
                                <div className="pass-meta">
                                    <span>Checked In: <strong>{pass.checkedIn ? 'Yes' : 'No'}</strong></span>
                                    <span>Checked Out: <strong>{pass.checkedOut ? 'Yes' : 'No'}</strong></span>
                                </div>
                                <div className="pass-actions">
                                    {!pass.checkedIn && pass.status === 'active' && (
                                        <button className="btn btn-success btn-sm" onClick={() => handleCheckin(pass._id)}>Check In</button>
                                    )}
                                    {pass.checkedIn && !pass.checkedOut && (
                                        <button className="btn btn-outline btn-sm" onClick={() => handleCheckout(pass._id)}>Check Out</button>
                                    )}
                                    {user?.role === 'admin' && pass.status === 'active' && (
                                        <button className="btn btn-danger btn-sm" onClick={() => handleRevoke(pass._id)}>Revoke</button>
                                    )}
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
