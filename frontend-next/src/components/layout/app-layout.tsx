import { Outlet } from 'react-router-dom';

import Footer from '../../components/layout/footer';
import Header from '../../components/layout/header';
import { MenuButtonProps } from '../../components/layout/MenuButton/MenuButton';

const menuButtons: MenuButtonProps[] = [
    {
        title: 'Dashboard',
        link: '/dashboard',
    },
    {
        title: 'Channels',
        link: '/channels',
    },
    {
        title: 'Automation',
        link: '/automation',
    },
];

const AppLayout = () => {
    return (
        <>
        <div className='flex flex-col min-h-screen'>
            <Header menuItems={menuButtons} />
            <div className='flex-grow flex flex-col'>
                <Outlet />
            </div>
            <Footer />
        </div>
        </>
    );
}

export default AppLayout;
