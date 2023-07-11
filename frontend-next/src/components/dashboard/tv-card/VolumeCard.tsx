import { memo } from 'react';

import { IconMinus, IconPlus } from '@tabler/icons-react';

import { Constants } from '../../../constants/constants';
import Heading from '../../layout/Heading';
import Card from '../../ui/Card';

interface VolumeCardProps {
    currentVolume?: number;
    isLoading?: boolean;
    onVolumeUp: () => void;
    onVolumeDown: () => void;
};

export const VolumeCard: React.FC<VolumeCardProps> = memo(({ currentVolume, isLoading, onVolumeUp, onVolumeDown }) => {
    const title = isLoading ? Constants.LOADING_TEXT : (currentVolume ?? Constants.UNKNOWN_VALUE_TEXT);

    return (
        <>
            <Card>
                <Card.UpperLeft>
                    <Card.Subtitle>Volume</Card.Subtitle>
                </Card.UpperLeft>
                <Card.LowerLeft>
                    <div className='grid grid-cols-2 gap-4'>
                        <button type='button' className='focus:outline-dotted'>
                            <IconMinus className='cursor-pointer' size={20} stroke={4} onClick={onVolumeDown} />
                        </button>
                        <button type='button' className='focus:outline-dotted'>
                            <IconPlus className='cursor-pointer' size={20} stroke={4} onClick={onVolumeUp} />
                        </button>
                    </div>
                </Card.LowerLeft>
                <Card.LowerRight>
                    <Heading
                        size='sm'
                        title={title}
                    />
                </Card.LowerRight>
            </Card>
        </>
    );
});
