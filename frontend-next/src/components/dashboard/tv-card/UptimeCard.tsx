import { memo } from 'react';

import { Constants } from '../../../constants/constants';
import { useHumanizedSeconds } from '../../../utils/hooks';
import Heading from '../../layout/Heading';
import Card from '../../ui/Card';

interface UptimeCardProps {
    uptimeInSeconds?: number;
};

export const UptimeCard: React.FC<UptimeCardProps> = memo(({ uptimeInSeconds }) => {
    const elapsedTime = useHumanizedSeconds(uptimeInSeconds);
    const title = elapsedTime ?? Constants.NOT_AVAILABLE_TEXT;

    return (
        <>
            <Card>
                <Card.UpperLeft>
                    <Card.Subtitle>Uptime</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerRight>
                    <Heading size='sm' title={title} />
                </Card.LowerRight>
            </Card>
        </>
    );
});
