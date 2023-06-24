import DashboardContainer from '../components/dashboard/DashboardContainer';

const Dashboard: React.FC = () => {
    return (
        <>
            <DashboardContainer>
                <DashboardContainer.Row>
                    <DashboardContainer.Card>01</DashboardContainer.Card>
                    <DashboardContainer.Card>02</DashboardContainer.Card>
                </DashboardContainer.Row>
                <DashboardContainer.Row>
                    <DashboardContainer.Card>03</DashboardContainer.Card>
                    <DashboardContainer.Card>04</DashboardContainer.Card>
                </DashboardContainer.Row>
            </DashboardContainer>
        </>
    );
};

export default Dashboard;
