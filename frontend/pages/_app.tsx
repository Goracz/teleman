import '../styles.css';

import { getCookie, setCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useState } from 'react';
import { Provider } from 'react-redux';

import { ColorScheme, ColorSchemeProvider, Global, MantineProvider } from '@mantine/core';
import { NavigationProgress } from '@mantine/nprogress';
import { SpotlightAction, SpotlightProvider } from '@mantine/spotlight';
import {
  IconArrowLeft,
  IconArrowRight,
  IconPlugOff,
  IconSearch,
  IconVolume,
  IconVolume2,
  IconVolumeOff,
} from '@tabler/icons-react';

import { EventsProvider } from '../components/EventsProvider';
import store from '../store';

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
      <Provider store={store}>
        <EventsProvider>
          <MantineProvider
            theme={{
              colorScheme,
              fontFamily: 'Poppins',
              transitionTimingFunction: 'ease',
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Global
              styles={(theme) => ({
                '.mantine-Paper-root': {
                  color: theme.colorScheme === 'dark' ? theme.colors.indigo[5] : undefined,
                  backgroundColor: theme.colorScheme === 'dark' ? '#1c153a' : undefined,
                },
                '.mantine-Navbar-root': {
                  color: theme.colorScheme === 'dark' ? theme.colors.indigo[5] : undefined,
                  backgroundColor: theme.colorScheme === 'dark' ? '#15102b' : undefined,
                  '.mantine-UnstyledButton-root': {
                    color: theme.colorScheme === 'dark' ? theme.colors.indigo[6] : undefined,
                  },
                },
                '.mantine-Header-root': {
                  color: theme.colorScheme === 'dark' ? theme.colors.indigo[6] : undefined,
                  backgroundColor: theme.colorScheme === 'dark' ? '#15102b' : undefined,
                },
              })}
            />
            <Head>
              <title>Teleman</title>
              <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
              />
              <link rel="shortcut icon" href="/favicon.svg" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link
                href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet"
              />
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
          </MantineProvider>
        </EventsProvider>
      </Provider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
