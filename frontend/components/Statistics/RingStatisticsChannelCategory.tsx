import {
  Badge,
  Card,
  Center,
  Group,
  RingProgress,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import moment from 'moment';
import { NextPage } from 'next';
import React from 'react';
import { useViewportSize } from '@mantine/hooks';
import { ChannelCategoryLegend } from '../../models/channel-category';
import { WebOSApplication } from '../../models/web-os-application';

interface StatsRingProps {
  data: {
    channelCategory: string;
    application: string;
    watchTime: number;
  }[];
}

const pieColors = [
  '#003c9e',
  '#0056c7',
  '#006fff',
  '#57a0ff',
  '#46c7fd',
  '#39cc64',
  '#bfe041',
  '#ffdb1',
  '#f5a623',
  '#f03a3e',
  '#a252e3',
  '#6b34e0',
].reverse();

export const RingStatisticsChannelCategory: NextPage<StatsRingProps> = ({ data }) => {
  const { height, width } = useViewportSize();

  const sumOfWatchTime = data.reduce((acc, curr) => acc + curr.watchTime, 0);
  const finalData = data
    .sort((a, b) => b.watchTime - a.watchTime)
    .map((d, index) => ({
      ...d,
      watchTimePercentage: (d.watchTime / sumOfWatchTime) * 100,
      color: pieColors[index],
    }));

  const formatTime = (input: any) => {
    const dur = moment.duration(input, 'seconds');
    const hours = Math.floor(dur.asHours());
    const mins = Math.floor(dur.asMinutes()) - hours * 60;
    const sec = Math.floor(dur.asSeconds()) - hours * 60 * 60 - mins * 60;

    return `${hours > 9 ? hours : `0${hours}`}:${mins > 9 ? mins : `0${mins}`}:${
      sec > 9 ? sec : `0${sec}`
    }`;
  };

  return (
    <Card style={{ minHeight: '25vh', height: '100%' }} shadow="md" radius="xl" p="sm">
      <Text mt={6} ml={12} weight={500}>
        Channel Category Overview
      </Text>
      <Group>
        <RingProgress
          size={height * 0.2}
          roundCaps
          thickness={height * 0.016}
          sections={finalData.map((statEntry) => ({
            value: statEntry.watchTimePercentage,
            color: statEntry.color,
            tooltip: (
              <>
                <Stack spacing="xs">
                  <Group>
                    <Text>Watch Time</Text>
                    <Text>{formatTime(statEntry.watchTime)}</Text>
                  </Group>
                  <Group>
                    <Text>Category</Text>
                    <Group spacing="xs">
                      <Badge style={{ backgroundColor: statEntry.color }} size="xs" radius="xl" />
                      <Text>
                        {statEntry.channelCategory
                          ? ChannelCategoryLegend[
                              statEntry.channelCategory as keyof typeof ChannelCategoryLegend
                            ]
                          : WebOSApplication[
                              statEntry.application as keyof typeof WebOSApplication
                            ]}
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </>
            ),
          }))}
          label={
            <Center>
              <Stack spacing={0} align="center">
                <Text size="xl" weight={500}>
                  {finalData.length}
                </Text>
                <Text size="sm" weight={400}>
                  {finalData.length > 1 ? 'Categories' : 'Category'}
                </Text>
              </Stack>
            </Center>
          }
        />

        <div>
          <Table>
            <thead>
              <tr>
                <th />
                <th>
                  <Text weight={600}>Category</Text>
                </th>
                <th>
                  <Text weight={600}>Watch Time</Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {finalData.map((statEntry, index) =>
                height > 1650
                  ? index < 5
                  : index < 3 && (
                      <tr
                        key={
                          statEntry.channelCategory
                            ? statEntry.channelCategory
                            : statEntry.application
                        }
                      >
                        <td>
                          <Badge
                            style={{ backgroundColor: statEntry.color }}
                            size="xs"
                            radius="xl"
                          />
                        </td>
                        <td>
                          <Group style={{ maxWidth: width > 1200 ? width * 0.06 : height * 0.3 }}>
                            <Tooltip
                              label={
                                statEntry.channelCategory
                                  ? ChannelCategoryLegend[
                                      statEntry.channelCategory as keyof typeof ChannelCategoryLegend
                                    ]
                                  : WebOSApplication[
                                      statEntry.application as keyof typeof WebOSApplication
                                    ]
                              }
                            >
                              <Text lineClamp={1}>
                                {statEntry.channelCategory
                                  ? ChannelCategoryLegend[
                                      statEntry.channelCategory as keyof typeof ChannelCategoryLegend
                                    ]
                                  : WebOSApplication[
                                      statEntry.application as keyof typeof WebOSApplication
                                    ]}
                              </Text>
                            </Tooltip>
                          </Group>
                        </td>
                        <td>
                          <Text lineClamp={1}>{formatTime(statEntry.watchTime)}</Text>
                        </td>
                      </tr>
                    )
              )}
            </tbody>
          </Table>
        </div>
      </Group>
    </Card>
  );
};
