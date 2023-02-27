import { Card } from '@mantine/core';
import React from 'react';

export interface UptimeChartTooltipProps {
  active: boolean;
  payload: any;
  label: string;
  getHourLabel: (hour: number) => string;
}

const getHourLabel = (hour: number): string => {
  if (hour === 0 || hour === 24) {
    return '00:00 ';
  }

  if (hour < 10) {
    return `0${hour}:00 `;
  }

  return `${hour}:00 `;
};

const UptimeChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length && payload[0].value > 0) {
    return (
      <Card>
        <span>
          <strong>{`${getHourLabel(label)} - ${getHourLabel(label + 1)}`}</strong>
        </span>
        <span>{`Up for ${payload[0].value} minutes`}</span>
      </Card>
    );
  }

  return null;
};

export default UptimeChartTooltip;
