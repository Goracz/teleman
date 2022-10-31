import React from 'react';
import {
  IconTool,
  IconSettings,
  IconPlayerSkipForward,
  IconDeviceTv,
  IconDashboard,
  IconSettingsAutomation,
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
    <Link href={link || '#'} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

const data = [
  { icon: <IconDashboard size={16} />, color: 'blue', label: 'Dashboard', link: '/dashboard' },
  { icon: <IconPlayerSkipForward size={16} />, color: 'teal', label: 'TV Control' },
  { icon: <IconDeviceTv size={16} />, color: 'violet', label: 'TV Channels', link: '/channels' },
  { icon: <IconSettingsAutomation size={16} />, color: 'cyan', label: 'Automations' },
  { icon: <IconSettings size={16} />, color: 'grape', label: 'Account Settings' },
  { icon: <IconTool size={16} />, color: 'red', label: 'Tenant Settings' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
