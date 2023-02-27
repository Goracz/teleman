import { NextPage } from 'next';
import {
  Anchor,
  Center,
  Group,
  Progress,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons';
import { useState } from 'react';
import { keys } from '@mantine/utils';
import ApplicationLayout from '../../layouts/Application';

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
  },
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface TableProps {
  serviceName: string;
  component: string;
  layers: number[];
  currentStatus: 'UP' | 'DOWN';
  statuses: { up: number; down: number };
}

const data: TableProps[] = [
  {
    serviceName: 'WebOS-Teleman Interface',
    component: 'Core',
    layers: [1],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'Apache Kafka',
    component: 'Mission-Critical Dependency',
    layers: [1, 2],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'Control Service',
    component: 'Core',
    layers: [2],
    currentStatus: 'UP',
    statuses: { up: 97, down: 3 },
  },
  {
    serviceName: 'Statistics Service',
    component: 'Core',
    layers: [2],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'Meta-Data Service',
    component: 'Core',
    layers: [2],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'Automation Service',
    component: 'Core',
    layers: [2],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'MongoDB',
    component: 'Mission-Critical Dependency',
    layers: [2],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'Redis',
    component: 'Additional Dependency',
    layers: [2],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
  {
    serviceName: 'User Interface',
    component: 'Core',
    layers: [3],
    currentStatus: 'UP',
    statuses: { up: 100, down: 0 },
  },
];

const getLabelForComponent = (component: string): string => {
  switch (component) {
    case 'Core':
      return 'This component is a core component; the application will not function without it.';
    case 'Mission-Critical Dependency':
      return 'This component is a mission-critical dependency; it is not directly part of the application, but will not function without it.';
    case 'Additional Dependency':
      return 'This component is an additional dependency; it is being used for optimization purposes only, so is not required for the application to function.';
  }
  return '';
};

function filterData(data: TableProps[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: TableProps[],
  payload: { sortBy: keyof TableProps | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

const DebugPage: NextPage = () => {
  const { classes, theme } = useStyles();

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof TableProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof TableProps) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = data.map((row: TableProps) => {
    const totalReviews = row.statuses.down + row.statuses.up;
    const positiveReviews = (row.statuses.up / totalReviews) * 100;
    const negativeReviews = (row.statuses.down / totalReviews) * 100;

    return (
      <tr key={row.serviceName}>
        <td>
          <Anchor<'a'> size="sm" onClick={(event) => event.preventDefault()}>
            {row.serviceName}
          </Anchor>
        </td>
        <td>
          <Tooltip label={getLabelForComponent(row.component)}>
            <span>{row.component}</span>
          </Tooltip>
        </td>
        <td>Layer {row.layers.join(', ')}</td>
        <td>{row.currentStatus}</td>
        <td>
          <Group position="apart">
            <Text size="xs" color="teal" weight={700}>
              {positiveReviews.toFixed(0)}%
            </Text>
            <Text size="xs" color="red" weight={700}>
              {negativeReviews.toFixed(0)}%
            </Text>
          </Group>
          <Progress
            classNames={{ bar: classes.progressBar }}
            sections={[
              {
                value: positiveReviews,
                color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
              },
              {
                value: negativeReviews,
                color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
              },
            ]}
          />
        </td>
      </tr>
    );
  });

  return (
    <ApplicationLayout>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: 'fixed', minWidth: 700 }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === 'serviceName'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('serviceName')}
              >
                Service
              </Th>
              <Th
                sorted={sortBy === 'component'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('component')}
              >
                Component
              </Th>
              <Th
                sorted={sortBy === 'layers'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('layers')}
              >
                Layers
              </Th>
              <Th
                sorted={sortBy === 'currentStatus'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('currentStatus')}
              >
                Current Status
              </Th>
              <Th
                sorted={sortBy === 'statuses'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('statuses')}
              >
                Uptime
              </Th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </ApplicationLayout>
  );
};

export default DebugPage;
