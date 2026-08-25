import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBadge, IconCheck, IconX } from '../components/Icons';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'visitor' })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Registration failed');
            } else {
                setSuccess('Registered successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError('Could not connect to server');
        }
    };

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="brand-mark"><IconBadge size={18} color="#fff" /></span>
                    <span>Gatepass</span>
                </div>
                <h2>Create your account</h2>
                <p className="auth-subtitle">Register as a visitor to request appointments</p>

                {error && <div className="alert alert-error"><IconX size={15} /> {error}</div>}
                {success && <div className="alert alert-success"><IconCheck size={15} /> {success}</div>}

                <form onSubmit={handleRegister}>
                    <div className="field" style={{ marginBottom: '14px' }}>
                        <label>Name</label>
                        <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="field" style={{ marginBottom: '14px' }}>
                        <label>Email</label>
                        <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="field" style={{ marginBottom: '20px' }}>
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">Register</button>
                </form>
                <p className="auth-footer">Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
}
