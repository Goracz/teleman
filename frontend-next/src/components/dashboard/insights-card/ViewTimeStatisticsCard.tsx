import { memo } from 'react';

import { Constants } from '../../../constants/constants';
import { colors } from '../../../styles/colors';
import { useHumanizedSeconds } from '../../../utils/hooks';
import Heading from '../../layout/Heading';
import Card, { RawCard } from '../../ui/Card';

interface ViewTimeStatisticsCardProps {
    viewTimeLastEightHoursSeconds?: number[];
    viewTimeAllTimeSeconds?: number;
};

export const ViewTimeStatisticsCard: React.FC<ViewTimeStatisticsCardProps> = memo(({ viewTimeLastEightHoursSeconds, viewTimeAllTimeSeconds }) => {
    const viewTimeHumanized = useHumanizedSeconds(viewTimeLastEightHoursSeconds?.reduce((a, b) => a + b, 0));
    const viewTimeAllTimeHumanized = useHumanizedSeconds(viewTimeAllTimeSeconds);

    return (
        <>
            <RawCard className="p-10" size='full' active decorationColor={colors.accent} stickyDecoration>
                <div className='flex flex-col h-full px-6 pt-6 pb-8'>
                    <div className='flex flex-row flex-grow justify-between'>
                        <Card.Subtitle size='lg'>View Time</Card.Subtitle>
                    </div>
                    <div className='border-black border-b-4 mb-8 pb-2 flex flex-rows justify-between'>
                        <div className='flex flex-col gap-3'>
                            <div>
                                <Heading title={viewTimeHumanized ?? `${Constants.NOT_AVAILABLE_TEXT} hours`} size='md' />
                            </div>
                            <div>
                                <Card.Subtitle size='lg'>
                                    This Week
                                </Card.Subtitle>
                            </div>
                        </div>
                        <div className='flex flex-row overflow-hidden gap-4 pr-2 pt-2'>
                            <div className='flex flex-col flex-grow px-2 bg-blue-400 rounded-full'></div>
                            <div className='flex flex-col flex-grow px-2 bg-blue-400 rounded-full'></div>
                            <div className='flex flex-col flex-grow px-2 bg-blue-400 rounded-full'></div>
                            <div className='flex flex-col flex-grow px-2 bg-blue-400 rounded-full'></div>
                            <div className='flex flex-col flex-grow px-2 bg-blue-400 rounded-full'></div>
                            <div className='flex flex-col flex-grow px-2 bg-accent rounded-full'></div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <Card.Subtitle size='lg'>
                            All Time
                        </Card.Subtitle>
                        <Card.Subtitle size='lg'>
                            {viewTimeAllTimeHumanized ?? `${Constants.NOT_AVAILABLE_TEXT} hours`}
                        </Card.Subtitle>
                    </div>
                </div>
            </RawCard>
        </>
    );
});
