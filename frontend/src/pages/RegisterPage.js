import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
            <div>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Name</label><br />
                        <input type='text' value={name} onChange={e => setName(e.target.value)} required style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box'
                        }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Email</label><br />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box'
                        }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Password</label><br />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box'
                        }} />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1677ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px'
                    }}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '16px' }}>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
}