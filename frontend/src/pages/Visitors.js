import { useState, useEffect } from 'react';

// visitors management page
export default function Visitors() {
    const [visitors, setVisitors] = useState([]);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [purpose, setPurpose] = useState('');
    const [photo, setPhoto] = useState(null); // photo state for file upload
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const [search, setSearch] = useState('');
    const filtered = visitors.filter(v => 
        v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())
    );

    // fetch visitors 
    useEffect(() => {
        fetchVisitors();
    }, []);

    // fetch all visitors from backend
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

    // handle visitor registration
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // use FormData instead of JSON so photo file can be sent
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('company', company);
            formData.append('purpose', purpose);
            if (photo) formData.append('photo', photo);

            const res = await fetch('http://localhost:5000/api/visitors', {
                method: 'POST',
                headers: {
                    // do NOT set Content-Type manually — browser sets it with boundary automatically
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to register visitor');
                return;
            }
            // clear form and reload visitors
            setName(''); setEmail(''); setPhone(''); setCompany(''); setPurpose(''); setPhoto(null);
            fetchVisitors();
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    // handle approve action for pending visitors
    const handleApprove = async (id) => {
        await fetch(`http://localhost:5000/api/visitors/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchVisitors();
    };

    // handle reject action for pending visitors
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
                <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={{ marginBottom: '8px' }} />
                <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: '8px' }} />
                <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} required style={{ marginBottom: '8px' }} />
                <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} style={{ marginBottom: '8px' }} />
                <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} required style={{ marginBottom: '8px' }} />

                {/* photo upload field */}
                <label style={{ display: 'block', marginBottom: '4px' }}>Visitor Photo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setPhoto(e.target.files[0])}
                    style={{ display: 'block', marginBottom: '8px' }}
                />
                {/* preview selected photo before submitting */}
                {photo && (
                    <img
                        src={URL.createObjectURL(photo)}
                        alt="preview"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '12px', borderRadius: '6px' }}
                    />
                )}

                <button type="submit">Register</button>
            </form>

            {/* Visitors list */}
            <h3>All Visitors</h3>
            <ul>
                {filtered.map((visitor) => (
                    <li key={visitor._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', listStyle: 'none' }}>
                        {/* show visitor photo if available */}
                        {visitor.photo && (
                            <img
                                src={`http://localhost:5000/uploads/${visitor.photo}`}
                                alt={visitor.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        )}
                        <span>{visitor.name} - {visitor.email} - {visitor.status}</span>
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