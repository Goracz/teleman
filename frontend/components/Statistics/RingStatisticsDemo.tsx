import { RingProgress, Text, Paper, Center, Group, Table } from '@mantine/core';
import { NextPage } from 'next';
import React from 'react';

interface StatsRingProps {
  data: {
    label: string;
    stats: string;
    progress: number;
    color: string;
    icon: 'up' | 'down';
  }[];
}

export const RingStatisticsDemo: NextPage<StatsRingProps> = ({ data }) => {
  const rows = [
    {
      channelCategory: 'Music',
      channelCount: 43,
    },
    {
      channelCategory: 'News',
      channelCount: 20,
    },
  ];

  const stats = data.map((stat) => (
    <Paper withBorder radius="md" p="xs" key={stat.label}>
      <Text mt={6} ml={12} weight={500}>
        Channels Overview
      </Text>
      <Group>
        <RingProgress
          size={220}
          roundCaps
          thickness={18}
          sections={[
            { value: stat.progress, color: 'cyan' || stat.color, tooltip: <Text>Music</Text> },
            { value: 30, color: '#68b5e8', tooltip: <Text>Gastronomy</Text> },
            { value: 20, color: '#6888e8', tooltip: <Text>News</Text> },
            { value: 7, color: '#8468e8', tooltip: <Text>Entertainment</Text> },
          ]}
          label={
            <Center>
              <Text size="sm" weight={400}>
                Channel categories
              </Text>
            </Center>
          }
        />

        <div>
          <Table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Channels</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((element: any) => (
                <tr key={element.channelCategory}>
                  <td>{element.channelCategory}</td>
                  <td>{element.channelCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Group>
    </Paper>
  ));
  return <>{stats}</>;
};
