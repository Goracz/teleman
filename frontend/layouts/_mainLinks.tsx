import Link from 'next/link';
import React from 'react';

import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import {
  Icon3dCubeSphere,
  IconCode,
  IconDashboard,
  IconDeviceTv,
  IconPlayerSkipForward,
  IconSettings,
  IconSettingsAutomation,
  IconTool,
} from '@tabler/icons';

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link?: string;
}

function MainLink({ icon, color, label, link }: MainLinkProps) {
  return (
    <Link href={link || '#'} style={{ textDecoration: 'none' }} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.sm,
          borderRadius: theme.radius.xl,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? '#231a49' : theme.colors.gray[1],
            transition: 'background-color 300ms ease',
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light" radius="xl">
            {icon}
          </ThemeIcon>

          <Text size="sm" weight="500">
            {label}
          </Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

const data = [
  { icon: <IconDashboard size={20} />, color: 'blue', label: 'Dashboard', link: '/dashboard' },
  { icon: <IconPlayerSkipForward size={20} />, color: 'teal', label: 'TV Control' },
  { icon: <IconDeviceTv size={20} />, color: 'violet', label: 'TV Channels', link: '/channels' },
  {
    icon: <IconSettingsAutomation size={20} />,
    color: 'cyan',
    label: 'TV Automations',
    link: '/automations',
  },
  { icon: <IconSettings size={20} />, color: 'grape', label: 'Manage TVs', link: '/manage-tvs' },
  { icon: <Icon3dCubeSphere size={20} />, color: 'pink', label: 'Integrations' },
  { icon: <IconTool size={20} />, color: 'red', label: 'Tenant Settings' },
  { icon: <IconCode size={20} />, color: 'orange', label: 'Debug', link: '/debug' },
];

export const MainLinks = () => {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
};
