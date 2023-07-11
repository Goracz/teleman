import { ChannelHistory } from '../../../models/channel-history';
import { useDominantColor, useImage } from '../../../utils/hooks';

const useMostViewedChannels = (channelHistories?: ChannelHistory[]) => {
    if (!channelHistories) return;

    // Get channels viewed during the last 7 days
    const channelsViewedLast7Days = channelHistories.filter((channelHistory) => {
        const today = new Date();
        const last7Days = new Date(today.setDate(today.getDate() - 7));
        const channelViewedDate = new Date(channelHistory.start);

        return channelHistory.end && channelViewedDate >= last7Days;
    });

    // Get the 5 most viewed channels
    const mostViewedChannels = channelsViewedLast7Days.sort((a, b) => {
        return (new Date(b.end).getTime() - new Date(b.start).getTime()) - (new Date (a.end).getTime() - new Date(a.start).getTime());
    }).slice(0, 5);

    const viewSecondsSummary = mostViewedChannels.reduce((acc, channelHistory) => {
        return acc + (new Date(channelHistory.end).getTime() - new Date(channelHistory.start).getTime());
    }, 0);

    return mostViewedChannels.map((channelHistory: ChannelHistory) => {
        const viewSeconds = new Date(channelHistory.end).getTime() - new Date(channelHistory.start).getTime();

        let dominantColor;
        if (channelHistory.channelLogoUrl) {
            const channelLogoImage = useImage(channelHistory.channelLogoUrl);
            dominantColor = useDominantColor(channelLogoImage, 50);
        }

        return {
            channelName: channelHistory.channelName,
            viewSeconds,
            quotient: (viewSeconds / viewSecondsSummary) * 100,
            logoUrl: channelHistory.channelLogoUrl,
            decorationColor: dominantColor ?? undefined,
        };
    });
};

export {
    useMostViewedChannels,
};
