import { Modal, Paper, Space, Text, Tooltip, useMantineColorScheme } from '@mantine/core';
import { NextPage } from 'next';
import {
  Channel,
  ChannelBox,
  ChannelLogo,
  Epg,
  Layout,
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramItem,
  ProgramStack,
  ProgramText,
  ProgramTitle,
  Theme,
  useEpg,
  useProgram,
} from 'planby';
import jaroWinkler from 'jaro-winkler';
import React, { memo, MouseEventHandler, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useViewportSize } from '@mantine/hooks';
import ApplicationLayout from '../../layouts/Application';
import { AppSliceState } from '../../store/app-slice';

interface ChannelItemProps {
  onClick: () => void;
  channel: Channel;
}

const parseDateString = (dateString: string): Date => {
  const year = parseInt(dateString.slice(0, 4), 10);
  const month = parseInt(dateString.slice(4, 6), 10) - 1;
  const day = parseInt(dateString.slice(6, 8), 10);
  const hours = parseInt(dateString.slice(8, 10), 10);
  const minutes = parseInt(dateString.slice(10, 12), 10);
  const seconds = parseInt(dateString.slice(12, 14), 10);
  const timezoneOffset = dateString.slice(15);

  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

  // Adjust the date based on the provided timezone offset
  const offsetSign = timezoneOffset[0];
  const offsetHours = parseInt(timezoneOffset.slice(1, 3), 10);
  const offsetMinutes = parseInt(timezoneOffset.slice(3, 5), 10);
  const totalOffsetMinutes = (offsetSign === '+' ? 1 : -1) * (offsetHours * 60 + offsetMinutes);

  date.setMinutes(date.getMinutes() - totalOffsetMinutes);

  return date;
};

const ProgramItem = memo(({ onClick, program, ...rest }: ProgramItem & { onClick: Function }) => {
  const { styles, formatTime, isLive, isMinWidth } = useProgram({ program, ...rest });

  const { data } = useMemo(() => program, [program]);
  const { title, since, till } = useMemo(() => data, [data]);

  const sinceTime = useMemo(() => formatTime(since), [since]);
  const tillTime = useMemo(() => formatTime(till), [till]);

  return (
    <Tooltip
      label={
        <>
          <Text>{title}</Text>
          <Text>
            {sinceTime} - {tillTime}
          </Text>
        </>
      }
    >
      <ProgramBox
        onClick={onClick as MouseEventHandler}
        width={styles.width}
        style={styles.position}
      >
        <ProgramContent width={styles.width} isLive={isLive}>
          <ProgramFlex>
            {isLive && isMinWidth && <></>}
            <ProgramStack>
              <ProgramTitle>{title}</ProgramTitle>
              <ProgramText>
                {sinceTime} - {tillTime}
              </ProgramText>
            </ProgramStack>
          </ProgramFlex>
        </ProgramContent>
      </ProgramBox>
    </Tooltip>
  );
});

const ChannelItem = memo(({ channel, onClick }: ChannelItemProps) => {
  const { position, logo } = useMemo(() => channel, [channel]);
  return (
    <Tooltip label={channel.displayName}>
      <ChannelBox onClick={onClick} {...position}>
        {logo && (
          <ChannelLogo onClick={() => console.log('channel', channel)} src={logo} alt="Logo" />
        )}
        {!logo && (
          <Text p="xl">
            <Text>{channel.displayName}</Text>
          </Text>
        )}
      </ChannelBox>
    </Tooltip>
  );
});

const darkTheme: Theme = {
  primary: {
    600: '#1a202c',
    900: '#141517',
  },
  grey: { 300: '#d1d1d1' },
  white: '#fff',
  green: {
    300: '#2c7a7b',
  },
  scrollbar: {
    border: '#ffffff',
    thumb: {
      bg: '#e1e1e1',
    },
  },
  loader: {
    teal: '#5DDADB',
    purple: '#3437A2',
    pink: '#F78EB6',
    bg: '#171923db',
  },
  gradient: {
    blue: {
      300: '#002eb3',
      600: '#002360',
      900: '#051937',
    },
  },
  text: {
    grey: {
      300: '#a0aec0',
      500: '#718096',
    },
  },
  timeline: {
    divider: {
      bg: '#718096',
    },
  },
};

// TODO: Create light theme and evaluate based on the Mantine theme hook which one to apply.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const lightTheme: Theme = {
  primary: {
    600: '#ffffff',
    900: '#f8f9fa',
  },
  grey: { 300: '#585f67' },
  white: '#fff',
  green: {
    300: '#439dea',
  },
  scrollbar: {
    border: '#ffffff',
    thumb: {
      bg: '#e1e1e1',
    },
  },
  loader: {
    teal: '#5DDADB',
    purple: '#3437A2',
    pink: '#F78EB6',
    bg: '#171923db',
  },
  gradient: {
    blue: {
      300: '#eaeff2',
      600: '#e5eaee',
      900: '#d9e0e8',
    },
  },
  text: {
    grey: {
      300: '#585f67',
      500: '#3c434b',
    },
  },
  timeline: {
    divider: {
      bg: '#e7f5ff',
    },
  },
};

const normalizeChannelName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[öóő]/g, 'o')
    .replace(/[üúű]/g, 'u')
    .replace(/é/g, 'e')
    .replace(/á/g, 'a')
    .replace(/í/g, 'i');

const setChannel = async (channelId: string) => {
  await fetch('http://localhost:8080/api/v1/tv/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channelId,
    }),
  });
};

const ChannelsPage: NextPage = memo(() => {
  const channelList = useSelector((state: { app: AppSliceState }) => state.app.channelList);
  const egp = useSelector((state: { app: AppSliceState }) => state.app.egpData);

  const { colorScheme } = useMantineColorScheme();
  const { width, height } = useViewportSize();

  const [programModalOpen, setProgramModalOpen] = React.useState(false);
  const [selectedProgram, setSelectedProgram] = React.useState<{
    data: ProgramItem & { title: string; description: string };
  } | null>(null);

  const minSimilarity = 0.7;

  const channelsData = useMemo(() => {
    const addedChannelNames = new Set();

    const filteredChannels = egp.channels
      .map((channel: any) => ({
        ...channel,
        uuid: channel.id,
      }))
      .filter((channel: any) => {
        const normalizedEgpChannelName = normalizeChannelName(channel.displayName);

        return channelList.channelList.some((existingChannel: any) => {
          const normalizedExistingChannelName = normalizeChannelName(existingChannel.channelName);
          const similarity = jaroWinkler(normalizedEgpChannelName, normalizedExistingChannelName);
          const isSimilar = similarity >= minSimilarity;
          const isTvCase =
            normalizedEgpChannelName.replace(' TV', '') === normalizedExistingChannelName ||
            normalizedEgpChannelName === normalizedExistingChannelName.replace(' TV', '');

          if ((isSimilar || isTvCase) && !addedChannelNames.has(normalizedEgpChannelName)) {
            if (isTvCase && normalizedEgpChannelName.includes('TV')) {
              return false;
            }
            addedChannelNames.add(normalizedEgpChannelName);
            return true;
          }

          return false;
        });
      });

    return filteredChannels.sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
  }, [channelList]);

  const egpData = useMemo(
    () =>
      egp.programmes.map((program: any) => ({
        ...program,
        channelUuid: egp.channels.find((channel: any) => channel.id === program.channel).id,
        since: parseDateString(program.start),
        till: parseDateString(program.stop),
        title: program.title.text,
        description: program.description ? program.description.text : '',
      })),
    [egp]
  );

  const { getEpgProps, getLayoutProps } = useEpg({
    theme: colorScheme === 'dark' ? darkTheme : lightTheme,
    epg: egpData,
    channels: channelsData,
    width: width * 0.87,
    height: height * 0.9,
  });

  const handleProgramClick = (
    program: { data: ProgramItem & { title: string; description: string } } | null
  ) => {
    console.log(program);
    setSelectedProgram(program);
    setProgramModalOpen(true);
  };

  return (
    <ApplicationLayout>
      <Modal
        opened={programModalOpen}
        onClose={() => setProgramModalOpen(false)}
        title="Program details"
      >
        {selectedProgram && (
          <>
            <Text pb="sm" weight={600}>
              {selectedProgram.data.title}
            </Text>
            <Text>{selectedProgram.data.description}</Text>
          </>
        )}
      </Modal>{' '}
      <Space h="md" />
      <Paper style={{ maxWidth: '87vw' }}>
        <Epg {...getEpgProps()} isLoading={!egpData}>
          <Layout
            {...getLayoutProps()}
            renderChannel={({ channel }) => (
              <ChannelItem
                key={channel.uuid}
                channel={channel}
                onClick={() => setChannel(channel.channelId)}
              />
            )}
            renderProgram={({ program, ...rest }) => (
              <ProgramItem
                key={program.data.id}
                program={program}
                {...rest}
                onClick={() => handleProgramClick(program as any)}
              />
            )}
          />
        </Epg>
      </Paper>
    </ApplicationLayout>
  );
});

export default ChannelsPage;
