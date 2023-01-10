import React from 'react';
import {
  IconChevronRight,
  IconChevronLeft,
  IconSettings,
  IconSearch,
  IconArrowsLeftRight,
  IconTrash,
} from '@tabler/icons';
import { UnstyledButton, Group, Avatar, Text, Box, useMantineTheme, Menu } from '@mantine/core';
import { openSpotlight } from '@mantine/spotlight';

export function User() {
  const theme = useMantineTheme();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Box
          sx={{
            paddingTop: theme.spacing.sm,
            borderTop: `1px solid ${
              theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,
          }}
        >
          <UnstyledButton
            sx={{
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.xl,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                transition: 'background-color 300ms ease',
              },
            }}
          >
            <Group>
              <Avatar radius="xl" />
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  Teleman User
                </Text>
              </Box>

              {theme.dir === 'ltr' ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
            </Group>
          </UnstyledButton>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />} disabled>
          Settings
        </Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" color="dimmed">
              ⌘K
            </Text>
          }
          onClick={() => openSpotlight()}
        >
          Search
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconArrowsLeftRight size={14} />} disabled>
          Transfer my data
        </Menu.Item>
        <Menu.Item color="red" icon={<IconTrash size={14} />} disabled>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
