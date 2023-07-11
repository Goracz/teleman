import moment from 'moment';
import { memo } from 'react';

import { ChannelHistory } from '../../models/channel-history';
import Heading from '../layout/Heading';
import { ChannelViewTable } from './insights-card/ChannelViewTable';
import { ViewTimeStatisticsCard } from './insights-card/ViewTimeStatisticsCard';

interface InsightsCardProps {

};

const mockChannelHistories: ChannelHistory[] = [{
    channelName: 'TLC',
    start: new Date().getTime(),
    end: moment.utc(new Date().getTime()).add(2, 'hours').toDate().getTime(),
    channelLogoUrl: 'https://digi.hu/api/uploads/TLC_3e01b75a29.svg',
} as ChannelHistory, {
    channelName: 'TLC 2',
    start: new Date().getTime(),
    end: moment.utc(new Date().getTime()).add(1, 'hours').toDate().getTime(),
    channelLogoUrl: 'https://digi.hu/api/uploads/TLC_3e01b75a29.svg',
} as ChannelHistory];

export const InsightsCard: React.FC<InsightsCardProps> = memo(() => {
    return (
        <>
            <Heading title='Insights' decoration='bg-accent-purple' extraDecorationPath='/insights-decoration.svg' />
            <div className='grid grid-cols-2 gap-8'>
                <ChannelViewTable channelHistories={mockChannelHistories} />
                <ViewTimeStatisticsCard />
            </div>
        </>
    );
});
