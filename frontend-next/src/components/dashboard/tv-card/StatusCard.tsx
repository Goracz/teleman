import { memo } from 'react';

import {
    useStatusCardDecorationColor, useStatusCardStateToggleButtonText
} from '../../../hooks/dashboard/tv-card/StatusCardHooks';
import { TvStatus } from '../../../models/tv/system/tv-status';
import Heading from '../../layout/Heading';
import Button from '../../layout/MenuButton/MenuButton';
import Card from '../../ui/Card';

interface StatusCardProps {
    status: TvStatus;
};

export const StatusCard: React.FC<StatusCardProps> = memo(({ status }) => {
    const cardDecorationColor = useStatusCardDecorationColor(status);
    const stateToggleButtonText = useStatusCardStateToggleButtonText(status);

    return (
        <>
            <Card decorationColor={cardDecorationColor} active stickyDecoration>
                <Card.UpperLeft>
                    <Card.Subtitle>Status</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerLeft>
                    {status !== TvStatus.Unknown && stateToggleButtonText && <Button title={stateToggleButtonText} link='#' variant="action" />}
                </Card.LowerLeft>
                <Card.LowerRight className="pb-1.5">
                    <Heading size='sm' title={status} />
                </Card.LowerRight>
            </Card>
        </>
    );
});
