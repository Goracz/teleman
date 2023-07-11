import jwt_decode from 'jwt-decode';

import { User } from '../models/teleman/auth/user';

const useUser = (token: string | null): User | null => {
    if (!token) return null;
    try {
        return jwt_decode(token) as User;
    } catch (e) {
        return null;
    }
};

export { useUser };
