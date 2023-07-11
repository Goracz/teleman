import { useMemo } from 'react';

import { ChannelCategory } from '../../../models/tv/channel/channel-category';
import { ChannelHistory } from '../../../models/tv/channel/channel-history';
import { ValueDirection } from '../../../models/tv/common/value-direction';
import { WebOSApplication } from '../../../models/tv/system/web-os-application';

const useValueDifferencePercentage = (previousValue?: number, currentValue?: number): number => {
    return useMemo(() => {
        if (!previousValue || !currentValue) return 0;

        const difference = currentValue - previousValue;
        const percentage = difference / previousValue * 100;
        return Number.parseFloat(percentage.toFixed(2));
    }, [previousValue, currentValue]);
};

const useValueDirectionTextDecorationClasses = (direction: ValueDirection, negateDirection: boolean = false): string => {
    const downClassNames = 'text-accent-red';
    const upClassNames = 'text-accent-green';
    const defaultClassNames = 'black';

    if (direction === 'up') {
        if (negateDirection) return downClassNames;
        else return upClassNames;
    }
    if (direction === 'down') {
        if (negateDirection) return upClassNames;
        else return downClassNames;
    }

    return defaultClassNames;
};

const useValueDirection = (valueDifference?: number): ValueDirection => {
    if (!valueDifference || valueDifference === 0) return 'default';

    if (valueDifference < 0) return 'down';
    else return 'up';
};

const useMostUsedApplication = (channelHistories?: ChannelHistory[]): string | undefined => {
    if (!channelHistories) return;

    const applicationUsageEntries = channelHistories.filter((channelHistory: ChannelHistory) => {
        return typeof channelHistory.application === 'string' && channelHistory.application !== WebOSApplication.BLANK;
    });

    const applicationUsage = applicationUsageEntries.reduce((accumulator: { [key: string]: number }, channelHistory: ChannelHistory) => {
        if (!accumulator[channelHistory.application]) accumulator[channelHistory.application] = 0;
        accumulator[channelHistory.application] += 1;
        return accumulator;
    }, {});

    const mostUsedApplication = Object.entries(applicationUsage).sort((a, b) => b[1] - a[1])[0][0];
    return mostUsedApplication;
};

const useMostViewedTopic = (channelHistories?: ChannelHistory[]): ChannelCategory | undefined => {
    if (!channelHistories) return;

    const channelViewEntries = channelHistories.filter((channelHistory: ChannelHistory) => {
        return typeof channelHistory.channelCategory === 'string';
    });

    const topicUsage = channelViewEntries.reduce((accumulator: { [key: string]: number }, channelHistory: ChannelHistory) => {
        if (!accumulator[channelHistory.channelCategory]) accumulator[channelHistory.channelCategory] = 0;
        accumulator[channelHistory.channelCategory] += 1;
        return accumulator;
    }, {});

    const mostViewedTopic = Object.entries(topicUsage).sort((a, b) => b[1] - a[1])[0][0];
    return ChannelCategory[mostViewedTopic as keyof typeof ChannelCategory];
};

const useMostViewedTopicViewTime = (channelHistories?: ChannelHistory[], mostViewedTopic?: ChannelCategory): number | undefined => {
    return channelHistories?.filter((channelHistory: ChannelHistory) => channelHistory.channelCategory === mostViewedTopic).reduce((accumulator, channelHistory) => accumulator + (new Date(channelHistory.end).getTime() - new Date(channelHistory.start).getTime()), 0);
};

const useEnergyUsageInPreviousWeek = (): number | undefined => {
    return;
};

const useEnergyUsageInCurrentWeek = (): number | undefined => {
    return;
};

const useViewTimeSecondsPreviousWeek = (): number | undefined => {
    return;
};

const useViewTimeSecondsCurrentWeek = (): number | undefined => {
    return;
};

export {
    useValueDifferencePercentage,
    useValueDirectionTextDecorationClasses,
    useValueDirection,
    useMostUsedApplication,
    useMostViewedTopic,
    useMostViewedTopicViewTime,
    useEnergyUsageInPreviousWeek,
    useEnergyUsageInCurrentWeek,
    useViewTimeSecondsPreviousWeek,
    useViewTimeSecondsCurrentWeek,
};
