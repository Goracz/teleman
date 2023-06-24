import { useLocation } from 'react-router-dom';

export const useActive = (link: string) => {
    const location = useLocation();
    return location.pathname === link;
};
