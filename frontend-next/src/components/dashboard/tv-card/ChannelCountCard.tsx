import { memo } from 'react';

import { Constants } from '../../../constants/constants';
import { ChannelType } from '../../../models/channel-type';
import Heading from '../../layout/Heading';
import Card from '../../ui/Card';

interface ChannelCountProps {
    channelType: ChannelType;
    isLoading?: boolean;
    channelCount?: number;
};

export const ChannelCountCard: React.FC<ChannelCountProps> = memo(({ channelType, isLoading, channelCount }) => {
    const title = isLoading ? Constants.LOADING_TEXT : (channelCount ?? Constants.NOT_AVAILABLE_TEXT);

    return (
        <>
            <Card>
                <Card.UpperLeft>
                    <Card.Subtitle>{channelType} Channels</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerRight>
                    <Heading size='sm' title={title} />
                </Card.LowerRight>
            </Card>
        </>
    );
});
