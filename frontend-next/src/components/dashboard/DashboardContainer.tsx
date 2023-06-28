import React, { memo, ReactNode } from 'react';

import { useLayoutContext } from '../layout/app-layout';

interface ContainerCardProps {
    children: ReactNode;
}

export const Card: React.FC<ContainerCardProps> = memo(({ children }) => {
    return (
        <div className='border-black border-4 p-6'>
            {children}
        </div>
    );
});

interface RowProps {
    children: ReactNode;
}

const Row: React.FC<RowProps> = memo(({ children }) => {
    return (
        <div className='grid grid-cols-2'>
            {children}
        </div>
    );
});

interface DashboardContainerProps {
    children: ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> & { Row: React.FC<RowProps>, Card: React.FC<RowProps> } = ({ children }) => {
    const { headerHeight, footerHeight } = useLayoutContext();

    return (
        <div className='grid grid-rows-2' style={{ height: `calc(100vh - ${headerHeight}px - ${footerHeight}px)` }}>
            {children}
        </div>
    );
};

DashboardContainer.Row = Row;
DashboardContainer.Card = Card;

export default DashboardContainer;
