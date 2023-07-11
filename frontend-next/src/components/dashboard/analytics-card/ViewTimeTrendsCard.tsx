import { memo } from 'react';

import {
    useValueDifferencePercentage, useValueDirection
} from '../../../hooks/dashboard/analytics-card';
import {
    useViewTimeDecorationColor, useViewTimeSummaryText, useViewTimeTextDecorationClasses
} from '../../../hooks/dashboard/analytics-card/ViewTimeSummaryCardHooks';
import Card from '../../ui/Card';
import { ValueDirectionIndicator } from './ValueDirectionIndicator';

interface ViewTimeTrendsCardProps {
    viewTimeSecondsPreviousWeek?: number;
    viewTimeSecondsCurrentWeek?: number;
};

export const ViewTimeTrendsCard: React.FC<ViewTimeTrendsCardProps> = memo(({ viewTimeSecondsPreviousWeek, viewTimeSecondsCurrentWeek }) => {
    const viewTimeDifference = useValueDifferencePercentage(viewTimeSecondsPreviousWeek, viewTimeSecondsCurrentWeek);
    const decorationColor = useViewTimeDecorationColor(viewTimeDifference);
    const summaryText = useViewTimeSummaryText(viewTimeDifference);
    const textDecorationClasses = useViewTimeTextDecorationClasses(viewTimeDifference);
    const direction = useValueDirection(viewTimeDifference);

    return (
        <>
            <Card size='lg' decorationColor={decorationColor}>
                <Card.UpperLeft>
                    <Card.Subtitle size='lg'>View Time</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerLeft>
                    <Card.Subtitle className={textDecorationClasses} size='lg'>{summaryText}</Card.Subtitle>
                </Card.LowerLeft>
                <Card.LowerRight>
                    <ValueDirectionIndicator direction={direction} negateDirection />
                </Card.LowerRight>
            </Card>
        </>
    );
});
