import { Card, Space, Text } from '@mantine/core';
import moment from 'moment/moment';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import React, { memo } from 'react';
import UptimeChartSkeleton from '../Skeleton/UptimeChartSkeleton';
import UptimeChartTooltip from './UptimeChartTooltip';

export interface UptimeChartProps {
  calculatedHourlyChannelView: any;
  colorScheme: any;
  tvUptime: any;
}

const UptimeChart = memo(
  ({ calculatedHourlyChannelView, colorScheme, tvUptime }: UptimeChartProps) => (
    <Card style={{ minHeight: '30vh' }} shadow="md" radius="xl" p="xs">
      <Text mt={6} ml={12} weight={500}>
        Uptime Overview
      </Text>
      <Space h="xs" />
      {(!calculatedHourlyChannelView ||
        (calculatedHourlyChannelView &&
          calculatedHourlyChannelView
            .map((stat: any) => stat.minutes)
            .reduce((acc: number, curr: number) => acc + curr, 0) === 0)) && (
        <UptimeChartSkeleton />
      )}
      {calculatedHourlyChannelView &&
        calculatedHourlyChannelView
          .map((stat: any) => stat.minutes)
          .reduce((acc: number, curr: number) => acc + curr, 0) > 0 && (
          <>
            <Text mt={2} ml={12} weight={400}>
              {tvUptime && (
                <span>
                  {calculatedHourlyChannelView &&
                  calculatedHourlyChannelView
                    .map((stat: any) => stat.minutes)
                    .reduce((acc: number, curr: number) => acc + curr, 0) > 0
                    ? `${moment
                        .duration(
                          calculatedHourlyChannelView
                            .map((stat: any) => stat.minutes)
                            .reduce((acc: number, curr: number) => acc + curr, 0),
                          'minutes'
                        )
                        .humanize()} `
                    : `${0} hours `}
                  today
                </span>
              )}
            </Text>
            <ResponsiveContainer width="99%" height={305}>
              <BarChart
                width={1580}
                height={295}
                data={calculatedHourlyChannelView}
                margin={{ top: 50, left: 10, right: 35, bottom: 40 }}
              >
                <defs>
                  {colorScheme.colorScheme === 'light' && (
                    <linearGradient id="colorUv" x1="0.15" y1="0.85" x2="0.85" y2="0.15">
                      <stop offset="0%" stopColor="#ac6ce4" />
                      <stop offset="8.33%" stopColor="#a769e4" />
                      <stop offset="16.67%" stopColor="#a266e4" />
                      <stop offset="25%" stopColor="#9d62e4" />
                      <stop offset="33.33%" stopColor="#975fe4" />
                      <stop offset="41.67%" stopColor="#915de4" />
                      <stop offset="50%" stopColor="#8b5ae4" />
                      <stop offset="58.33%" stopColor="#8557e5" />
                      <stop offset="66.67%" stopColor="#7d55e5" />
                      <stop offset="75%" stopColor="#7652e5" />
                      <stop offset="83.33%" stopColor="#6d50e5" />
                      <stop offset="100%" stopColor="#594ce6" />
                    </linearGradient>
                  )}
                  {colorScheme.colorScheme === 'dark' && (
                    <linearGradient id="colorUv" x1="0.15" y1="0.85" x2="0.85" y2="0.15">
                      <stop offset="0%" stopColor="#873dc7" />
                      <stop offset="8.33%" stopColor="#833cc7" />
                      <stop offset="16.67%" stopColor="#7f3cc6" />
                      <stop offset="25%" stopColor="#7a3cc6" />
                      <stop offset="33.33%" stopColor="#763bc6" />
                      <stop offset="41.67%" stopColor="#713bc6" />
                      <stop offset="50%" stopColor="#6c3ac6" />
                      <stop offset="58.33%" stopColor="#673ac6" />
                      <stop offset="66.67%" stopColor="#6139c6" />
                      <stop offset="75%" stopColor="#5b39c6" />
                      <stop offset="83.33%" stopColor="#5539c7" />
                      <stop offset="100%" stopColor="#4539c6" />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="hour"
                  tickCount={10}
                  interval={2}
                  domain={[0, 23]}
                  strokeDasharray="1 1"
                  fontFamily="Poppins"
                  fontWeight={500}
                />
                <YAxis
                  domain={[0, 60]}
                  strokeDasharray="1 1"
                  fontFamily="Poppins"
                  fontWeight={500}
                />
                <Tooltip
                  wrapperStyle={{ outline: 'none' }}
                  allowEscapeViewBox={{ x: false, y: false }}
                  isAnimationActive={false}
                  cursor={{
                    fill: colorScheme.colorScheme === 'light' ? '#E9ECEF' : '#373B41',
                  }}
                  content={<UptimeChartTooltip />}
                />
                <Bar
                  dataKey="minutes"
                  radius={24}
                  fill="url(#colorUv)"
                  className="uptime-chart-bar"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
    </Card>
  )
);

export default UptimeChart;
