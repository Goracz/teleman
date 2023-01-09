import {
  RingProgress,
  Text,
  Paper,
  Center,
  Group,
  Table,
  Badge,
  Space,
  Stack,
  Image,
  Tooltip,
} from '@mantine/core';
import moment from 'moment';
import { NextPage } from 'next';
import React from 'react';
import { ChannelCategory, ChannelCategoryLegend } from '../../models/channel-category';
import { useViewportSize } from '@mantine/hooks';

interface StatsRingProps {
  data: {
    channelName: string;
    channelCategory: ChannelCategory;
    channelLogoUrl: string;
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
];

export const RingStatistics: NextPage<StatsRingProps> = ({ data }) => {
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
    <Paper style={{ minHeight: '25vh', height: '100%' }} withBorder radius="md" p="xs">
      <Text mt={6} ml={12} weight={500}>
        Channels Overview
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
                    <Image width="1vw" height="2vh" src={statEntry.channelLogoUrl} />
                    <Text>{statEntry.channelName}</Text>
                  </Group>
                  <Space />
                  <Group>
                    <Text>Watch Time</Text>
                    <Text>{formatTime(statEntry.watchTime)}</Text>
                  </Group>
                  <Group>
                    <Text>Category</Text>
                    <Text>{ChannelCategoryLegend[statEntry.channelCategory]}</Text>
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
                  Channels
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
                <th>Channel</th>
                <th>Watch Time</th>
              </tr>
            </thead>
            <tbody>
              {finalData.map((statEntry, index) =>
                height > 1650
                  ? index < 5
                  : index < 3 && (
                      <tr key={statEntry.channelName}>
                        <td>
                          <Badge
                            style={{ backgroundColor: statEntry.color }}
                            size="xs"
                            radius="xl"
                          />
                        </td>
                        <td>
                          <Group style={{ maxWidth: width > 1200 ? width * 0.06 : height * 0.3 }}>
                            <Tooltip label={statEntry.channelName}>
                              <Group
                                noWrap
                                style={{
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  overflow: 'clip',
                                }}
                              >
                                <Image width="1vw" height="2vh" src={statEntry.channelLogoUrl} />
                                <Text
                                  style={{
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    overflow: 'clip',
                                  }}
                                >
                                  {statEntry.channelName}
                                </Text>
                              </Group>
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
    </Paper>
  );
};
