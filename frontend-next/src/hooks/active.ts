import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useActive = (link: string) => {
    const location = useLocation();
    return useMemo(() => {
        return location.pathname === link;
    }, [location]);
};

export const useUpperLeft = (children: React.ReactNode) => {
    return useMemo(() => {
        if (children && Array.isArray(children))
            return children?.filter((child: any) => child.type.name === 'UpperLeft');
    }, [children]);
};

export const useUpperRight = (children: React.ReactNode) => {
    return useMemo(() => {
        if (children && Array.isArray(children))
            return children?.filter((child: any) => child.type.name === 'UpperRight');
    }, [children]);
};

export const useLowerLeft = (children: React.ReactNode) => {
    return useMemo(() => {
        if (children && Array.isArray(children))
            return children?.filter((child: any) => child.type.name === 'LowerLeft');
    }, [children]);
};

export const useLowerRight = (children: React.ReactNode) => {
    return useMemo(() => {
        if (children && Array.isArray(children))
            return children?.filter((child: any) => child.type.name === 'LowerRight');
    }, [children]);
};
