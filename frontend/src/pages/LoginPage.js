import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { IconBadge, IconMail, IconLock, IconX } from '../components/Icons';

// login page component
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();
    const navigate = useNavigate();

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        // if no error, go to dashboard
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="brand-mark"><IconBadge size={18} color="#fff" /></span>
                    <span>Gatepass</span>
                </div>
                <h2>Welcome back</h2>
                <p className="auth-subtitle">Sign in to manage visitors and access passes</p>

                <form onSubmit={handleSubmit}>
                    <div className="field" style={{ marginBottom: '14px' }}>
                        <label><IconMail size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} />Email</label>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field" style={{ marginBottom: '20px' }}>
                        <label><IconLock size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} />Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="btn btn-primary btn-full">
                        {isLoading ? 'Signing in…' : 'Login'}
                    </button>

                    <p className="auth-footer">
                        New visitor? <a href="/register">Register here</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
