// @ts-ignore
import ColorThief from 'colorthief';
import { memo } from 'react';

import { IconArrowLeft, IconArrowRight, IconChevronDown } from '@tabler/icons-react';

import { useDominantColor, useImage } from '../../../utils/hooks';
import Heading from '../../layout/Heading';
import Card from '../../ui/Card';

interface ChannelCardProps {
    channelName: string;
    channelLogoUrl?: string;
    onPreviousChannel: () => void;
    onNextChannel: () => void;
};

export const ChannelCard: React.FC<ChannelCardProps> = memo(({ channelName, channelLogoUrl, onPreviousChannel, onNextChannel }) => {
    const image = useImage(channelLogoUrl);
    const dominantColor = useDominantColor(image);

    return (
        <>
            <Card decorationColor={dominantColor}>
                <Card.UpperLeft>
                    <Card.Subtitle>Channel</Card.Subtitle>
                </Card.UpperLeft>
                <Card.UpperRight>
                    <button type='button' className='focus:outline-dotted'>
                        <IconChevronDown className='cursor-pointer' size={32} stroke={3} />
                    </button>
                </Card.UpperRight>
                <Card.LowerLeft>
                    <div className='grid grid-cols-2 gap-2'>
                        <button type='button' className='focus:outline-dotted'>
                            <IconArrowLeft className='cursor-pointer' size={24} stroke={3} onClick={onPreviousChannel} />
                        </button>
                        <button type='button' className='focus:outline-dotted'>
                            <IconArrowRight className='cursor-pointer' size={24} stroke={3} onClick={onNextChannel} />
                        </button>
                    </div>
                </Card.LowerLeft>
                <Card.LowerRight>
                    {channelLogoUrl ? (
                        <img src={channelLogoUrl} alt={channelName} className='h-10 w-10' />
                    ) : (
                        <Heading size='sm' title={channelName} />
                    )}
                </Card.LowerRight>
            </Card>
        </>
    );
});
