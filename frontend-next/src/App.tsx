import './App.css';

import { DashboardContainer } from './components/dashboard/DashboardContainer';
import Footer from './components/layout/footer';
import Header from './components/layout/header';

const App = () => {
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
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
        <Footer />
      </div>
    </>
  );
}

export default App;
