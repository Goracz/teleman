import { Button, createStyles, Group, Paper, Space, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { IconAdjustmentsAlt, IconApps, IconPlugOff, IconPower, IconVolume2 } from '@tabler/icons';

import { AutomationAction } from '../models/automation-action';

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 150ms ease, box-shadow 100ms ease',
    padding: theme.spacing.xl,
    paddingLeft: theme.spacing.xl * 2,

    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'scale(1.02)',
    },

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 6,
      backgroundImage: theme.fn.linearGradient(0, theme.colors.pink[6], theme.colors.orange[6]),
    },
  },
}));

interface CardGradientProps {
  id: string;
  title: string;
  description: string;
  cronSchedule?: string;
  actions: AutomationAction[];
}

export const AutomationCard = ({
  id,
  title,
  description,
  cronSchedule,
  actions,
}: CardGradientProps) => {
  const { classes } = useStyles();

  const handleDeleteRule = async (): Promise<void> => {
    await fetch(`http://localhost:8083/api/v1/automations/${id}`, { method: 'POST' });
  };

  return (
    <Paper radius="md" shadow="sm" className={classes.card}>
      <Group>
        {actions.find((action) => action.type === ('TURN_ON' as any)) && (
          <Tooltip label="Turn TV On">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ deg: 0, from: 'pink', to: 'orange' }}
            >
              <IconPower size={28} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>
        )}
        {actions.find((action) => action.type === ('TURN_OFF' as any)) && (
          <Tooltip label="Turn TV Off">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ deg: 0, from: 'pink', to: 'orange' }}
            >
              <IconPlugOff size={28} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>
        )}
        {actions.find((action) => action.type === ('SET_VOLUME' as any)) && (
          <Tooltip label="Set Volume">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ deg: 0, from: 'pink', to: 'orange' }}
            >
              <IconVolume2 size={28} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>
        )}
        {actions.find((action) => action.type === ('SET_CHANNEL' as any)) && (
          <Tooltip label="Set Channel">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ deg: 0, from: 'pink', to: 'orange' }}
            >
              <IconAdjustmentsAlt size={28} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>
        )}
        {actions.find((action) => action.type === ('OPEN_APPLICATION' as any)) && (
          <Tooltip label="Open Application">
            <ThemeIcon
              size="xl"
              radius="md"
              variant="gradient"
              gradient={{ deg: 0, from: 'pink', to: 'orange' }}
            >
              <IconApps size={28} stroke={1.5} />
            </ThemeIcon>
          </Tooltip>
        )}
      </Group>
      <Text size="xl" weight={500} mt="md">
        {title}
      </Text>
      <Text size="sm" mt="sm" color="dimmed">
        {description}
      </Text>
      <Space h="md" />
      <Text size="sm" mt="sm" color="dimmed">
        Schedule Type: {cronSchedule ? 'Cron Job' : 'Date Time-based Job'}
      </Text>
      <Text size="sm" mt="sm" color="dimmed">
        Cron Expression:{' '}
        <a
          href={`https://crontab.guru/#${cronSchedule?.replaceAll(' ', '_')}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', textDecoration: 'inherit' }}
        >
          {cronSchedule}
        </a>
      </Text>
      <Space h="xl" />
      <Group>
        <Button variant="light" color="blue" size="xs" radius="xl">
          Modify
        </Button>
        <Button onClick={handleDeleteRule} variant="light" color="red" size="xs" radius="xl">
          Delete
        </Button>
      </Group>
    </Paper>
  );
};
