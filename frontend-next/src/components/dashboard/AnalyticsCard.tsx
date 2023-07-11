import {
    useEnergyUsageInCurrentWeek, useEnergyUsageInPreviousWeek, useMostUsedApplication,
    useMostViewedTopic, useMostViewedTopicViewTime, useViewTimeSecondsCurrentWeek,
    useViewTimeSecondsPreviousWeek
} from '../../hooks/dashboard/analytics-card';
import { ChannelHistory } from '../../models/channel-history';
import Heading from '../layout/Heading';
import { EnergySaveSummaryCard } from './analytics-card/EnergySaveSummaryCard';
import { MostUsedAppCard } from './analytics-card/MostUsedAppCard';
import { MostViewedTopicCard } from './analytics-card/MostViewedTopicCard';
import { ViewTimeTrendsCard } from './analytics-card/ViewTimeTrendsCard';

interface AnalyticsCardProps {
    channelHistories?: ChannelHistory[];
};

// TODO: Provide ApplicationUrl
export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ channelHistories }) => {
    const mostUsedApplication = useMostUsedApplication(channelHistories);
    const mostViewedTopic = useMostViewedTopic(channelHistories);
    const mostViewedTopicViewTime = useMostViewedTopicViewTime(channelHistories, mostViewedTopic);
    const energyUsageInPreviousWeek = useEnergyUsageInPreviousWeek()
    const energyUsageInCurrentWeek = useEnergyUsageInCurrentWeek();
    const viewTimeSecondsPreviousWeek = useViewTimeSecondsPreviousWeek();
    const viewTimeSecondsCurrentWeek = useViewTimeSecondsCurrentWeek();

    return (
        <>
            <Heading title='Analytics' decoration='bg-accent-red' extraDecorationPath='/analytics-decoration.svg' />
            <div className='grid grid-rows-2 gap-10 py-8 px-4'>
                <div className='grid xl:grid-cols-2 md:grid-cols-1 gap-8'>
                    <MostUsedAppCard applicationName={mostUsedApplication} />
                    <MostViewedTopicCard topic={mostViewedTopic} viewTimeInSeconds={mostViewedTopicViewTime} />
                </div>
                <div className='grid xl:grid-cols-2 md:grid-cols-1 gap-8'>
                    <ViewTimeTrendsCard
                        viewTimeSecondsPreviousWeek={viewTimeSecondsPreviousWeek}
                        viewTimeSecondsCurrentWeek={viewTimeSecondsCurrentWeek}
                    />
                    <EnergySaveSummaryCard
                        energyUsageInCurrentWeek={energyUsageInCurrentWeek}
                        energyUsageInPreviousWeek={energyUsageInPreviousWeek}
                    />
                </div>
            </div>
        </>
    );
};
