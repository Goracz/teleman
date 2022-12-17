import { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { SpotlightAction, SpotlightProvider } from '@mantine/spotlight';
import { NavigationProgress } from '@mantine/nprogress';
import { NotificationsProvider } from '@mantine/notifications';
import { Provider } from 'react-redux';

import {
  IconArrowLeft,
  IconArrowRight,
  IconPlugOff,
  IconSearch,
  IconVolume,
  IconVolume2,
  IconVolumeOff,
} from '@tabler/icons';
import store from '../store';
import { EventsProvider } from '../components/EventsProvider';

const actions: SpotlightAction[] = [
  {
    title: 'Volume Up',
    description: 'Turns the volume up',
    onTrigger: () => console.log('Turn volume up command triggered'),
    icon: <IconVolume size={18} />,
  },
  {
    title: 'Volume Down',
    description: 'Turns the volume down',
    onTrigger: () => console.log('Turn volume down command triggered'),
    icon: <IconVolume2 size={18} />,
  },
  {
    title: 'Mute Volume',
    description: 'Mutes the volume',
    onTrigger: () => console.log('Mute volume command triggered'),
    icon: <IconVolumeOff size={18} />,
  },
  {
    title: 'Next Channel',
    description: 'Goes to the next channel',
    onTrigger: () => console.log('Next channel command triggered'),
    icon: <IconArrowRight size={18} />,
  },
  {
    title: 'Previous Channel',
    description: 'Goes to the previous channel',
    onTrigger: () => console.log('Previous channel command triggered'),
    icon: <IconArrowLeft size={18} />,
  },
  {
    title: 'Turn TV Off',
    description: 'Turns the currently selected TV off',
    onTrigger: () => console.log('TV turn off command triggered'),
    icon: <IconPlugOff size={18} />,
  },
];

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <Provider store={store}>
            <EventsProvider>
              <Head>
                <title>Teleman</title>
                <meta
                  name="viewport"
                  content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <link rel="shortcut icon" href="/favicon.svg" />
              </Head>

              <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <SpotlightProvider
                  shortcut={['mod + P', 'mod + K', '/']}
                  actions={actions}
                  searchIcon={<IconSearch size={18} />}
                  nothingFoundMessage="No actions found"
                >
                  <NavigationProgress />
                  <Component {...pageProps} />
                </SpotlightProvider>
              </ColorSchemeProvider>
            </EventsProvider>
          </Provider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
