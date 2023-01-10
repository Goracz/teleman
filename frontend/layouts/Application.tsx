import { AppShell, Code, Group, Header, Navbar, Tooltip, ThemeIcon, Text, Button } from '@mantine/core';
import { NextPage } from 'next';
import { IconPlug, IconPlugOff } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { DropdownWithIcon } from '../components/Dropdown/DropdownWithIcon';

import { Logo } from './_logo';
import { MainLinks } from './_mainLinks';
import { User } from './_user';
import { ColorSchemeToggleButton } from '../components/ColorSchemeToggleButton/ColorSchemeToggleButton';
import { AppSliceState } from '../store/app-slice';

const onlinePowerStates = ['Active', 'Active Standby'];
const offlinePowerStates = ['Suspend'];

const ApplicationLayout: NextPage<any> = ({ children }) => {
  const connectionStatus = useSelector(
    (state: { app: AppSliceState }) => state.app.connectionStatus
  );
  const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);

  const router = useRouter();

  const [pageName, setPageName] = useState<string>();

  useEffect(() => {
    switch (router.pathname) {
      case '/dashboard':
        setPageName('Dashboard');
        break;
      case '/channels':
        setPageName('TV Channels');
        break;
      case '/automations':
        setPageName('Automations');
        break;
      case '/debug':
        setPageName('Debug');
    }
  }, [router.pathname]);

  return (
    <AppShell
      padding="lg"
      fixed
      navbar={
        <Navbar width={{ base: 300 }} p="lg">
          <Navbar.Section grow>
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <ColorSchemeToggleButton />
            <User />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} px="xs">
          <Group sx={{ height: '100%' }} px={20} position="apart">
            <Group spacing="xl">
              <Group spacing="xs">
                <Logo width={50} height={50} />
                <Text size={18} weight={800}>
                  Teleman
                </Text>
              </Group>
              <Code sx={{ fontWeight: 700 }} mt={6}>
                v2023.01.09.dev
              </Code>
              <Text ml={0} weight="bold">
                {pageName}
              </Text>
            </Group>
            <Group spacing="xl">
              {powerState &&
                connectionStatus !== 2 &&
                onlinePowerStates.includes(powerState.state) && (
                    <Button
                      compact
                      leftIcon={<IconPlug />}
                      variant="gradient"
                      gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                      radius="xl"
                    >
                      Directly Connected
                    </Button>
                )}
              {powerState &&
                connectionStatus !== 2 &&
                offlinePowerStates.includes(powerState.state) && (
                  <Button
                    compact
                    leftIcon={<IconPlug />}
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    radius="xl"
                  >
                    Connected
                  </Button>
                )}
              {connectionStatus && connectionStatus === 2 && (
                  <Button
                    compact
                    leftIcon={<IconPlugOff />}
                    variant="gradient"
                    gradient={{ from: 'orange', to: 'red' }}
                    radius="xl"
                  >
                    Disconnected
                  </Button>
              )}
              {false && <DropdownWithIcon />}
            </Group>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default ApplicationLayout;
