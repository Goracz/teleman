import { memo } from 'react';

import Heading from '../../layout/Heading';
import Card from '../../ui/Card';

interface LanIpCardProps {
    lanIp: string;
};

export const LanIpCard: React.FC<LanIpCardProps> = memo(({ lanIp }) => {
    return (
        <>
            <Card>
                <Card.UpperLeft>
                    <Card.Subtitle>LAN IP</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerRight>
                    <Heading size='sm' title={lanIp} />
                </Card.LowerRight>
            </Card>
        </>
    );
});
