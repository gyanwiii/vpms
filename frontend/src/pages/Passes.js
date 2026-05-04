import { useState, useEffect } from "react";

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

    // create new pass
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/passes', {
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
        await fetch(`http://localhost:5000/api/passes/${id}/checkin`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPasses();
    };

    // check-out pass
    const handleCheckout = async (id) => {
        await fetch(`http://localhost:5000/api/passes/${id}/checkout`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPasses();
    };

    // revoke pass (admin only)
    const handleRevoke = async (id) => {
        await fetch(`http://localhost:5000/api/passes/${id}/revoke`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPasses();
    };

    return (
        <div style={{ padding: '20px' }}>
            <a href="/dashboard">← Back to Dashboard</a>
            <h2>Passes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* create pass form */}
            <h3>Issue New Pass</h3>
            <form onSubmit={handleCreate}>
                <input
                    placeholder="Visitor ID"
                    value={visitorId}
                    onChange={e => setVisitorId(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={validDate}
                    onChange={e => setValidDate(e.target.value)}
                    required
                />
                <button type="submit">Issue Pass</button>
            </form>

            {/* passes list */}
            <h3>All Passes</h3>
            <ul>
                {passes.map((pass) => (
                    <li key={pass._id}>
                        {pass.passNo} - {pass.status} -
                        Checked In: {pass.checkedIn ? 'Yes' : 'No'} -
                        Checked Out: {pass.checkedOut ? 'Yes' : 'No'}
                        {pass.qrCode && (
                            <img src={pass.qrCode} alt="QR Code" style={{ width: '100px', height: '100px' }} />
                        )}
                        {!pass.checkedIn && pass.status === 'active' && (
                            <button onClick={() => handleCheckin(pass._id)}>Check In</button>
                        )}
                        {pass.checkedIn && !pass.checkedOut && (
                            <button onClick={() => handleCheckout(pass._id)}>Check Out</button>
                        )}
                        {user?.role === 'admin' && pass.status === 'active' && (
                            <button onClick={() => handleRevoke(pass._id)}>Revoke</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}