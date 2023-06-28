import { createContext, memo, useContext, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Footer from '../../components/layout/footer';
import Header from '../../components/layout/header';
import { ButtonProps } from '../../components/layout/MenuButton/MenuButton';

const menuButtons: ButtonProps[] = [
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

const LayoutContext = createContext({ headerHeight: 0, footerHeight: 0 });
export const useLayoutContext = () => useContext(LayoutContext);

const AppLayout = memo(() => {
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

    const layoutContextValue = useMemo(() => ({ headerHeight, footerHeight }), [headerHeight, footerHeight]);

    return (
      <LayoutContext.Provider value={layoutContextValue}>
        <div className='flex flex-col min-h-screen'>
          <Header menuItems={menuButtons} onHeightChange={setHeaderHeight} />
          <div className='flex-grow flex flex-col'>
            <Outlet />
          </div>
          <Footer onHeightChange={setFooterHeight} />
        </div>
      </LayoutContext.Provider>
    );
});

export default AppLayout;
