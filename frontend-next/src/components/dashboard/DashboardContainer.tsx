import React, { ReactNode } from 'react';

interface ContainerCardProps {
    children: ReactNode;
}

export const Card: React.FC<ContainerCardProps> = ({ children }) => {
    return (
        <div className='flex-grow border-black border-4'>
            {children}
        </div>
    );
};

interface RowProps {
    children: ReactNode;
}

const Row: React.FC<RowProps> = ({ children }) => {
    return (
        <div className='flex-grow flex flex-row'>
            {children}
        </div>
    );
};

interface DashboardContainerProps {
    children: ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> & { Row: React.FC<RowProps>, Card: React.FC<RowProps> } = ({ children }) => {
    return (
        <div className='flex-grow flex flex-col'>
            {children}
        </div>
    );
};

DashboardContainer.Row = Row;
DashboardContainer.Card = Card;

export default DashboardContainer;
