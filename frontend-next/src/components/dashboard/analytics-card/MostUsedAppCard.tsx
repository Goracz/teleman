import { memo } from 'react';

import { IconQuestionMark } from '@tabler/icons-react';

import { useDominantColor, useImage } from '../../../utils/hooks';
import Card from '../../ui/Card';

interface MostUsedAppCardProps {
    applicationName?: string;
    applicationIconUrl?: string;
};

export const MostUsedAppCard: React.FC<MostUsedAppCardProps> = memo(({ applicationName, applicationIconUrl }) => {
    const image = useImage(applicationIconUrl);
    const decorationColor = useDominantColor(image);

    return (
        <>
            <Card size='lg' active decorationColor={decorationColor} stickyDecoration>
                <Card.UpperLeft>
                    <Card.Subtitle size='lg'>Most Used App</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerLeft>
                    <Card.Subtitle size='lg'>{applicationName ?? 'N/A'}</Card.Subtitle>
                </Card.LowerLeft>
                <Card.LowerRight>
                    <Card.Subtitle size='lg'>
                        {applicationIconUrl ? (
                            <img src={applicationIconUrl} alt={applicationName} className='h-16 w-16' />
                        ) : (<IconQuestionMark stroke={3} size={40} />)}
                    </Card.Subtitle>
                </Card.LowerRight>
            </Card>
        </>
    );
});
