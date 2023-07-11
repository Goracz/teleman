import { useMemo } from 'react';

import { TvStatus } from '../../../models/tv/system/tv-status';
import { colors } from '../../../styles/colors';

const useStatusCardDecorationColor = (tvStatus: TvStatus): string => {
    return useMemo(() => {
        switch (tvStatus) {
            case TvStatus.Up:
                return colors['accent-green'];
            case TvStatus.Down:
                return colors['accent-red'];
            default:
                return 'black';
        }
    }, [tvStatus]);
};

const useStatusCardStateToggleButtonText = (tvStatus: TvStatus): string | undefined => {
    return useMemo(() => {
        if (tvStatus === TvStatus.Unknown) return;
        return `Turn ${tvStatus === TvStatus.Up  ? 'Off' : 'On'}`
    }, [tvStatus]);
};

export {
    useStatusCardDecorationColor,
    useStatusCardStateToggleButtonText,
};
