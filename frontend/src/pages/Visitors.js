import { useState, useEffect } from 'react';

export default function Visitors() {
    const [visitors, setVisitors] = useState([]);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [purpose, setPurpose] = useState('');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const [search, setSearch] = useState('');
    const filtered = visitors.filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/visitors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to load visitors');
                return;
            }
            setVisitors(data);
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/visitors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, phone, company, purpose })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to register visitor');
                return;
            }
            // clear form and reload visitors
            setName(''); setEmail(''); setPhone(''); setCompany(''); setPurpose('');
            fetchVisitors();
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    const handleApprove = async (id) => {
        await fetch(`http://localhost:5000/api/visitors/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchVisitors();
    };

    const handleReject = async (id) => {
        await fetch(`http://localhost:5000/api/visitors/${id}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchVisitors();
    };

    return (
        <div style={{ padding: '20px' }}>
            <a href="/dashboard">← Back to Dashboard</a>
            <h2>Visitors</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Search bar */}
            <input
                placeholder="Search by name or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginBottom: '20px', padding: '5px', width: '300px' }}
            />
            {/* Register form */}
            <h3>Register New Visitor</h3>
            <form onSubmit={handleRegister}>
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required />
                <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
                <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} required />
                <button type="submit">Register</button>
            </form>

            {/* Visitors list */}
            <h3>All Visitors</h3>
            <ul>
                {filtered.map((visitor) => (
                    <li key={visitor._id}>
                        {visitor.name} - {visitor.email} - {visitor.status}
                        {/* show approve/reject only for admin and security */}
                        {(user?.role === 'admin' || user?.role === 'security') && visitor.status === 'pending' && (
                            <>
                                <button onClick={() => handleApprove(visitor._id)}>Approve</button>
                                <button onClick={() => handleReject(visitor._id)}>Reject</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}