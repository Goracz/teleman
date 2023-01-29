import React from 'react';
import {
    IconArrowsLeftRight,
    IconChevronLeft,
    IconChevronRight,
    IconDoorExit,
    IconSearch,
    IconSettings,
    IconTrash,
} from '@tabler/icons';
import { Avatar, Box, Group, Menu, Skeleton, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import { openSpotlight } from '@mantine/spotlight';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useLogout } from '../hooks/auth';
import { AppSliceState } from '../store/app-slice';

export const User = () => {
    const user = useSelector((state: { app: AppSliceState }) => state.app.user);
    const theme = useMantineTheme();
    const router = useRouter();

    return (
        <Menu radius="lg" shadow="md" width={200}>
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
                            <Avatar size={32} radius="xl" />
                            <Box sx={{ flex: 1 }}>
                                {!user && (<Skeleton height={12} width="90%" />)}
                                {user && (
                                    <Text
                                      lineClamp={1}
                                      size="sm"
                                      weight={500}
                                    >
                                        {user.email}
                                    </Text>
                                )}
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
                <Menu.Item color="red" icon={<IconDoorExit size={14} />} onClick={() => useLogout(router)}>
                    Logout
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
};
