import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { LoginCredentials } from '../models/login-credentials';
import { LoginResponse } from '../models/login-response';
import { RegistrationCredentials } from '../models/registration-credentials';
import { fetcher } from '../utils/hooks';

const AUTH_SERVICE_BASE_URL: string = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;

const useLogin = async ({ email, password }: LoginCredentials): Promise<string | undefined> => {
    const { isLoading: _isLoading, error, data } = useQuery({
        queryKey: ['login'],
        queryFn: () => fetcher<LoginResponse>(`${AUTH_SERVICE_BASE_URL}/login`, {
            body: { email, password },
            method: 'POST',
        }),
    });
    if (error) throw new Error('Failed to sign in.');
    return data?.token;
};

const useRegister = async ({
    email,
    password,
    firstName,
    lastName,
}: RegistrationCredentials): Promise<boolean> => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['register'],
        queryFn: () => fetch(`${AUTH_SERVICE_BASE_URL}/register`, {
            body: JSON.stringify({ email, password, firstName, lastName }),
            method: 'POST',
        }).then((res) => res.json()),
    });
    return !isLoading && !error && data.ok;
};

const useLogout = (): void => {
    const navigate = useNavigate();
    localStorage.removeItem('token');
    navigate('/auth');
};

export { useLogin, useRegister, useLogout };
