import { memo } from 'react';

import {
    ChannelCategory, ChannelCategoryLegend
} from '../../../models/tv/channel/channel-category';
import { useHumanizedSeconds } from '../../../utils/hooks';
import Card from '../../ui/Card';

interface MostViewedTopicCardProps {
    topic?: ChannelCategory;
    viewTimeInSeconds?: number;
};

export const MostViewedTopicCard: React.FC<MostViewedTopicCardProps> = memo(({ topic, viewTimeInSeconds }) => {
    const elapsedTime = useHumanizedSeconds(viewTimeInSeconds)

    return (
        <>
            <Card size='lg'>
                <Card.UpperLeft>
                    <Card.Subtitle size='lg'>Most Viewed Topic</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerLeft>
                    <Card.Subtitle size='lg'>
                        {topic ? ChannelCategoryLegend[topic as keyof typeof ChannelCategoryLegend] : 'N/A'} - {elapsedTime ?? '? hours'}
                    </Card.Subtitle>
                </Card.LowerLeft>
            </Card>
        </>
    );
});
