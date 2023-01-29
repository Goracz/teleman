import { NextRouter } from 'next/router';
import { LoginCredentials } from '../models/login-credentials';
import { LoginResponse } from '../models/login-response';
import { RegistrationCredentials } from '../models/registration-credentials';

const AUTH_SERVICE_BASE_URL = 'http://localhost:8084/api/v1';

const useLogin = async ({ email, password }: LoginCredentials): Promise<string> => {
    const response: Response = await fetch(`${AUTH_SERVICE_BASE_URL}/login`, {
        body: JSON.stringify({ email, password }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return ((await response.json()) as LoginResponse).token;
};

const useRegister = async ({
                               email,
                               password,
                               firstName,
                               lastName,
                           }: RegistrationCredentials): Promise<boolean> => {
    const response = await fetch(`${AUTH_SERVICE_BASE_URL}/register`, {
        body: JSON.stringify({ email, password, firstName, lastName }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.ok;
};

const useLogout = async (router: NextRouter): Promise<void> => {
    localStorage.removeItem('token');
    await router.replace('/auth');
};

export { useLogin, useRegister, useLogout };
