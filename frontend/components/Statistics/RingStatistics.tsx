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
} from '@mantine/core';
import moment from 'moment';
import { NextPage } from 'next';
import React from 'react';
import { ChannelCategory, ChannelCategoryLegend } from '../../models/channel-category';

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
  const sumOfWatchTime = data.reduce((acc, curr) => acc + curr.watchTime, 0);
  const finalData = data
    .sort((a, b) => b.watchTime - a.watchTime)
    .map((d, index) => ({
      ...d,
      watchTimePercentage: (d.watchTime / sumOfWatchTime) * 100,
      color: pieColors[index],
    }));

  return (
    <Paper withBorder radius="md" p="xs">
      <Text mt={6} ml={12} weight={500}>
        Channels Overview
      </Text>
      <Group>
        <RingProgress
          size={220}
          roundCaps
          thickness={18}
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
                    <Text>{moment(statEntry.watchTime).format('HH:mm:ss')}</Text>
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
              {finalData.map(
                (statEntry, index) =>
                  index < 5 && (
                    <>
                      <tr key={statEntry.channelCategory}>
                        <td>
                          <Badge
                            style={{ backgroundColor: statEntry.color }}
                            size="xs"
                            radius="xl"
                          />
                        </td>
                        <td>
                          <Group>
                            <Image width="1vw" height="2vh" src={statEntry.channelLogoUrl} />
                            {statEntry.channelName}
                          </Group>
                        </td>
                        <td>{moment(statEntry.watchTime).format('HH:mm:ss')}</td>
                      </tr>
                    </>
                  )
              )}
            </tbody>
          </Table>
        </div>
      </Group>
    </Paper>
  );
};
