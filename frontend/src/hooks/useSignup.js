import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    // signup function to call backend API
    const signup = async (name, email, password, role) => {
        setIsLoading(true);
        setError(null);

        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
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

    return { signup, error, isLoading };
};