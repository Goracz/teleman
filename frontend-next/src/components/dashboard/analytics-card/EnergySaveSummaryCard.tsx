import { memo } from 'react';

import {
    useValueDifferencePercentage, useValueDirection
} from '../../../hooks/dashboard/analytics-card';
import {
    useViewTimeDecorationColor, useViewTimeSummaryText, useViewTimeTextDecorationClasses
} from '../../../hooks/dashboard/analytics-card/ViewTimeSummaryCardHooks';
import Card from '../../ui/Card';
import { ValueDirectionIndicator } from './ValueDirectionIndicator';

interface EnergySaveSummaryCardProps {
    energyUsageInPreviousWeek?: number;
    energyUsageInCurrentWeek?: number;
};

export const EnergySaveSummaryCard: React.FC<EnergySaveSummaryCardProps> = memo(({ energyUsageInPreviousWeek, energyUsageInCurrentWeek }) => {
    const energyUsageDifference = useValueDifferencePercentage(energyUsageInPreviousWeek, energyUsageInCurrentWeek);
    const decorationColor = useViewTimeDecorationColor(energyUsageDifference);
    const summaryText = useViewTimeSummaryText(energyUsageDifference);
    const textDecorationClasses = useViewTimeTextDecorationClasses(energyUsageDifference);
    const direction = useValueDirection(energyUsageDifference);

    return (
        <>
            <Card size='lg' decorationColor={decorationColor}>
                <Card.UpperLeft>
                    <Card.Subtitle size='lg'>Energy Savings</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerLeft>
                    <Card.Subtitle className={textDecorationClasses} size='lg'>{summaryText}</Card.Subtitle>
                </Card.LowerLeft>
                <Card.LowerRight>
                    <ValueDirectionIndicator direction={direction} />
                </Card.LowerRight>
            </Card>
        </>
    );
});
