import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    // login function to call backend API
    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            setIsLoading(false);
            setError(data.error);
            return;
        }

        // save to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // update auth context
        dispatch({ type: 'LOGIN', payload: data.user });
        setIsLoading(false);
    };

    return { login, error, isLoading };
};