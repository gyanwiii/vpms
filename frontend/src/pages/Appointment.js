import { useState, useEffect } from 'react';
import { IconArrowLeft, IconCalendar, IconCheck, IconX } from '../components/Icons';

export default function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [visitorName, setVisitorName] = useState('');
    const [visitorEmail, setVisitorEmail] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [purpose, setPurpose] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchAppointments();
    }, []);

    // fetch all appointments from backend
    const fetchAppointments = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to load appointments');
                return;
            }
            setAppointments(data);
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    // create new appointment
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ visitorName, visitorEmail, visitorPhone, purpose, date })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to create appointment');
                return;
            }
            setVisitorName(''); setVisitorEmail(''); setVisitorPhone(''); setPurpose(''); setDate('');
            fetchAppointments();
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    // approve appointment
    const handleApprove = async (id) => {
        await fetch(`http://localhost:5000/api/appointments/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAppointments();
    };

    // reject appointment
    const handleReject = async (id) => {
        await fetch(`http://localhost:5000/api/appointments/${id}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAppointments();
    };

    const canModerate = user?.role === 'admin' || user?.role === 'security';

    return (
        <div className="page">
            <a href="/dashboard" className="back-link"><IconArrowLeft size={14} /> Back to Dashboard</a>

            <div className="page-header">
                <div>
                    <h1>Appointments</h1>
                    <p className="page-subtitle">Schedule visits and approve pending requests</p>
                </div>
            </div>

            {/* {error && <div className="alert alert-error"><IconX size={15} /> {error}</div>} */}

            <div className="panel">
                <div className="section-title">Create New Appointment</div>
                <form onSubmit={handleCreate}>
                    <div className="field-grid">
                        <div className="field">
                            <label>Visitor Name</label>
                            <input placeholder="Full name" value={visitorName} onChange={e => setVisitorName(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Visitor Email</label>
                            <input placeholder="visitor@email.com" value={visitorEmail} onChange={e => setVisitorEmail(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Visitor Phone</label>
                            <input placeholder="+91 98765 43210" value={visitorPhone} onChange={e => setVisitorPhone(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Purpose</label>
                            <input placeholder="Reason for visit" value={purpose} onChange={e => setPurpose(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label>Date &amp; Time</label>
                            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Create Appointment</button>
                    </div>
                </form>
            </div>

            <div className="section-title">
                All Appointments <span className="count">({appointments.length})</span>
            </div>

            {appointments.length === 0 ? (
                <div className="empty-state">
                    <IconCalendar size={26} style={{ marginBottom: '8px', color: 'var(--text-faint)' }} />
                    <div>No appointments scheduled yet.</div>
                </div>
            ) : (
                <ul className="list">
                    {appointments.map((appt) => (
                        <li key={appt._id} className="row-card">
                            <div className="row-avatar">{appt.visitorName?.[0]?.toUpperCase()}</div>
                            <div className="row-body">
                                <div className="row-title">{appt.visitorName}</div>
                                <div className="row-sub">
                                    {appt.purpose}
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                            </div>
                            {canModerate && appt.status === 'pending' && (
                                <div className="row-actions">
                                    <button className="btn btn-success btn-sm" onClick={() => handleApprove(appt._id)}>
                                        <IconCheck size={14} /> Approve
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(appt._id)}>
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
