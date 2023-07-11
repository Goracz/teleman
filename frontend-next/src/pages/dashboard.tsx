import { memo } from 'react';

import { AnalyticsCard } from '../components/dashboard/AnalyticsCard';
import DashboardContainer from '../components/dashboard/DashboardContainer';
import { InsightsCard } from '../components/dashboard/InsightsCard';
import { QuickLaunchCard } from '../components/dashboard/QuickLaunchCard';
import { TvCard } from '../components/dashboard/TvCard';
import { useLaunchPoints } from '../hooks';

const Dashboard: React.FC = memo(() => {
    const launchPoints = useLaunchPoints();

    return (
        <>
            <DashboardContainer>
                <DashboardContainer.Row>
                    <DashboardContainer.Card>
                        <TvCard />
                    </DashboardContainer.Card>
                    <DashboardContainer.Card>
                        <AnalyticsCard />
                    </DashboardContainer.Card>
                </DashboardContainer.Row>
                <DashboardContainer.Row>
                    <DashboardContainer.Card>
                        <QuickLaunchCard launchPoints={launchPoints.data?.launchPoints} />
                    </DashboardContainer.Card>
                    <DashboardContainer.Card>
                        <InsightsCard />
                    </DashboardContainer.Card>
                </DashboardContainer.Row>
            </DashboardContainer>
        </>
    );
});

export default Dashboard;
