import { AppShell, Code, Group, Header, Navbar, Tooltip, ThemeIcon, Text } from '@mantine/core';
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
import { PowerState } from '../models/power-state-change';

const onlinePowerStates = ['Active', 'Active Standby'];
const offlinePowerStates = ['Suspend'];

const ApplicationLayout: NextPage<any> = ({ children }) => {
  // const connectionStatus = useSelector(
  //   (state: { app: AppSliceState }) => state.app.connectionStatus
  // );
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
    }
  }, [router.pathname]);

  return (
    <AppShell
      padding="md"
      fixed={false}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow mt="xs">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <ColorSchemeToggleButton />
            <User />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position="apart">
            <Group spacing="xl">
              <Group spacing="xs">
                <Logo width={50} height={50} />
                <Text size={18} weight={800}>
                  Teleman
                </Text>
              </Group>
              <Code sx={{ fontWeight: 700 }} mt={6}>
                v2022.12.26.dev
              </Code>
              <Text ml={0} weight="bold">
                {pageName}
              </Text>
            </Group>
            <Group spacing="xl">
              {powerState && onlinePowerStates.includes(powerState.state) && (
                <Tooltip label="You have a direct connection">
                  <ThemeIcon radius="lg" color="teal" variant="light" size={34}>
                    <IconPlug color="teal" size={20} />
                  </ThemeIcon>
                </Tooltip>
              )}
              {powerState && offlinePowerStates.includes(powerState.state) && (
                <Tooltip label="You have a connection">
                  <ThemeIcon radius="lg" color="blue" variant="light" size={34}>
                    <IconPlug color="blue" size={20} />
                  </ThemeIcon>
                </Tooltip>
              )}
              {powerState && powerState.state === PowerState.Offline && (
                <Tooltip label="You don't have a connection">
                  <ThemeIcon radius="lg" color="red" variant="light" size={34}>
                    <IconPlugOff color="red" size={20} />
                  </ThemeIcon>
                </Tooltip>
              )}
              <DropdownWithIcon />
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
