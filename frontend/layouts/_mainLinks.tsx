import React from 'react';
import {
  IconTool,
  IconSettings,
  IconPlayerSkipForward,
  IconDeviceTv,
  IconDashboard,
  IconSettingsAutomation,
  IconCode,
} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import Link from 'next/link';

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
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            transition: 'background-color 300ms ease',
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light" radius="xl">
            {icon}
          </ThemeIcon>

          <Text size="sm" weight="500">{label}</Text>
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
    label: 'Automations',
    link: '/automations',
  },
  { icon: <IconSettings size={20} />, color: 'grape', label: 'Account Settings' },
  { icon: <IconTool size={20} />, color: 'red', label: 'Tenant Settings' },
  { icon: <IconCode size={20} />, color: 'orange', label: 'Debug', link: '/debug' },
];

export const MainLinks = () => {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
};
