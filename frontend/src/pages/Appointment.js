import { useState, useEffect } from 'react';

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

    const handleApprove = async (id) => {
        await fetch(`http://localhost:5000/api/appointments/${id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAppointments();
    };

    const handleReject = async (id) => {
        await fetch(`http://localhost:5000/api/appointments/${id}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAppointments();
    };

    return (
        <div style={{ padding: '20px' }}>
            <a href="/dashboard">← Back to Dashboard</a>
            <h2>Appointments</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Create New Appointment</h3>
            <form onSubmit={handleCreate}>
                <input placeholder="Visitor Name" value={visitorName} onChange={e => setVisitorName(e.target.value)} required />
                <input placeholder="Visitor Email" value={visitorEmail} onChange={e => setVisitorEmail(e.target.value)} required />
                <input placeholder="Visitor Phone" value={visitorPhone} onChange={e => setVisitorPhone(e.target.value)} required />
                <input placeholder="Purpose" value={purpose} onChange={e => setPurpose(e.target.value)} required />
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
                <button type="submit">Create</button>
            </form>

            <h3>All Appointments</h3>
            <ul>
                {appointments.map((appt) => (
                    <li key={appt._id}>
                        {appt.visitorName} - {appt.purpose} - {appt.status}
                        {(user?.role === 'admin' || user?.role === 'security') && appt.status === 'pending' && (
                            <>
                                <button onClick={() => handleApprove(appt._id)}>Approve</button>
                                <button onClick={() => handleReject(appt._id)}>Reject</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}