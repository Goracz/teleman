// @ts-ignore
import ColorThief from 'colorthief';
import { memo } from 'react';

import { useLaunchApp } from '../../../hooks';
import { useDominantColor, useImage } from '../../../utils/hooks';
import Card from '../../ui/Card';

interface AppLaunchCardProps {
    applicationName: string;
    applicationIconUrl: string;
    applicationLaunchPointId: string;
    [prop: string]: any;
};

export const AppLaunchCard: React.FC<AppLaunchCardProps> = memo(({ applicationName, applicationIconUrl, applicationLaunchPoint, className, onLaunchApplication, ...props }) => {
    const image = useImage(applicationIconUrl);
    const dominantColor = useDominantColor(image);

    const handleLaunchApplication = () => useLaunchApp(applicationLaunchPoint);

    return (
        <>
            <Card size='lg' decorationColor={dominantColor} onClick={handleLaunchApplication}>
                <Card.UpperLeft>
                    <Card.Subtitle size='lg'>{applicationName}</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerRight>
                    <Card.Subtitle size='lg'>
                        <img src={applicationIconUrl} alt={applicationName} className={`h-16 ${className}`} {...props} />
                    </Card.Subtitle>
                </Card.LowerRight>
            </Card>
        </>
    );
});
