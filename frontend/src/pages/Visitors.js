import { useState, useEffect } from 'react';
import { IconArrowLeft, IconSearch, IconUsers, IconCheck, IconX } from '../components/Icons';

// visitors management page
export default function Visitors() {
    const [visitors, setVisitors] = useState([]);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [purpose, setPurpose] = useState('');
    const [photo, setPhoto] = useState(null); 

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
            const res = await fetch('http:///api/visitors', {
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

            const res = await fetch('http:///api/visitors', {
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
        await fetch(`http:///api/visitors/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchVisitors();
    };

    // handle reject action for pending visitors
    const handleReject = async (id) => {
        await fetch(`http:///api/visitors/${id}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchVisitors();
    };

    const canModerate = user?.role === 'admin' || user?.role === 'security';

    return (
        <div className="page">
            <a href="/dashboard" className="back-link"><IconArrowLeft size={14} /> Back to Dashboard</a>

            <div className="page-header">
                <div>
                    <h1>Visitors</h1>
                    <p className="page-subtitle">Register new visitors and manage approvals</p>
                </div>
                <div className="field" style={{ minWidth: '260px' }}>
                    <div style={{ position: 'relative' }}>
                        <IconSearch size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-faint)' }} />
                        <input
                            placeholder="Search by name or email"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ paddingLeft: '34px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Register form */}
            <div className="panel">
                <div className="section-title">Register New Visitor</div>
                <form onSubmit={handleRegister}>
                    <div className="field-grid">
                        <div className="field">
                            <label>Name</label>
                            <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <input placeholder="visitor@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Phone</label>
                            <input placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Company</label>
                            <input placeholder="Company (optional)" value={company} onChange={e => setCompany(e.target.value)} />
                        </div>
                        <div className="field">
                            <label>Purpose</label>
                            <input placeholder="Reason for visit" value={purpose} onChange={e => setPurpose(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Visitor Photo</label>
                            <div className="file-drop">
                                <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
                                {photo && <img src={URL.createObjectURL(photo)} alt="preview" className="avatar-preview" />}
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Register Visitor</button>
                    </div>
                </form>
            </div>

            {/* Visitors list */}
            <div className="section-title">
                All Visitors <span className="count">({filtered.length})</span>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <IconUsers size={26} style={{ marginBottom: '8px', color: 'var(--text-faint)' }} />
                    <div>No visitors match your search yet.</div>
                </div>
            ) : (
                <ul className="list">
                    {filtered.map((visitor) => (
                        <li key={visitor._id} className="row-card">
                            {visitor.photo ? (
                                <img
                                    src={`http:///uploads/${visitor.photo}`}
                                    alt={visitor.name}
                                    className="row-avatar"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="row-avatar">{visitor.name?.[0]?.toUpperCase()}</div>
                            )}
                            <div className="row-body">
                                <div className="row-title">{visitor.name}</div>
                                <div className="row-sub">
                                    {visitor.email}
                                    <span className={`badge badge-${visitor.status}`}>{visitor.status}</span>
                                </div>
                            </div>
                            {canModerate && visitor.status === 'pending' && (
                                <div className="row-actions">
                                    <button className="btn btn-success btn-sm" onClick={() => handleApprove(visitor._id)}>
                                        <IconCheck size={14} /> Approve
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(visitor._id)}>
                                        <IconX size={14} /> Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
