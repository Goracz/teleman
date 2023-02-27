import { Group, Paper, Text } from '@mantine/core';
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appActions } from '../../store/app-slice';

const Filter = () => {
  const currentDate = new Date();

  const [filterDateRange, setFilterDateRange] = React.useState<DateRangePickerValue>([
    new Date(currentDate.getFullYear(), 1, 1),
    currentDate,
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.setFilteredChannelHistory(filterDateRange));
  }, [filterDateRange]);

  return (
    <Paper shadow="md" radius="xl" px={30} py={10}>
      <Group position="apart">
        <Text>Filters</Text>
        <DateRangePicker
          style={{ width: '14vw' }}
          radius="xl"
          placeholder="Pick dates range"
          value={filterDateRange}
          onChange={setFilterDateRange}
        />
      </Group>
    </Paper>
  );
};

export default Filter;
