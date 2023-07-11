import { useMemo } from 'react';

import { colors } from '../../../styles/colors';

export const useViewTimeDecorationColor = (viewTimeDifference?: number): string => {
    return useMemo(() => {
        if (!viewTimeDifference) return 'black';
        return viewTimeDifference < 0 ? colors['accent-green'] : colors['accent-red'];
    }, [viewTimeDifference]);
};

export const useViewTimeSummaryText = (viewTimeDifference?: number): string => {
    return useMemo(() => {
        if (!viewTimeDifference) return 'N/A';
        return viewTimeDifference < 0 ? `-${Math.abs(viewTimeDifference)}%` : `+${viewTimeDifference}% since last week`;
    }, [viewTimeDifference]);
};

export const useViewTimeTextDecorationClasses = (viewTimeDifference?: number): string => {
    return useMemo(() => {
        if (!viewTimeDifference || viewTimeDifference === 0) return 'black';
        return viewTimeDifference < 0 ? 'text-accent-green' : 'text-accent-red';
    }, [viewTimeDifference]);
};
