import { memo } from 'react';

import { LaunchPoint } from '../../models/launch-point';
import Heading from '../layout/Heading';
import { AppLaunchCard } from './quick-launch-card/AppLaunchCard';

interface QuickLaunchCardProps {
    launchPoints: LaunchPoint[] | undefined;
};

export const QuickLaunchCard: React.FC<QuickLaunchCardProps> = memo(({ launchPoints }) => {
    const firstTwoLaunchPoints = launchPoints && launchPoints.length >= 2 ? launchPoints?.copyWithin(2, 0) : null;
    const secondTwoLaunchPoints = launchPoints && launchPoints.length >= 4 ? launchPoints?.copyWithin(2, 2) : null;

    return (
        <>
            <Heading title='Quick Launch' decoration='bg-accent-orange' extraDecorationPath='/quick-launch-decoration.svg' />
            <div className='grid grid-rows-2 gap-10 py-8 px-4'>
                <div className='grid grid-cols-2 gap-8'>
                    {firstTwoLaunchPoints?.map((launchPoint: LaunchPoint) => (
                        <AppLaunchCard
                            key={launchPoint.id}
                            applicationName={launchPoint.title}
                            applicationIconUrl={launchPoint.icon}
                            applicationLaunchPointId={launchPoint.launchPointId}
                        />
                    ))}
                </div>
                <div className='grid grid-cols-2 gap-8'>
                    {secondTwoLaunchPoints?.map((launchPoint: LaunchPoint) => (
                        <AppLaunchCard
                            key={launchPoint.id}
                            applicationName={launchPoint.title}
                            applicationIconUrl={launchPoint.icon}
                            applicationLaunchPointId={launchPoint.launchPointId}
                        />
                    ))}
                </div>
            </div>
        </>
    );
});
