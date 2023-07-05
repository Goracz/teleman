import { NextPage } from 'next';
import {
  Channel,
  ChannelBox,
  ChannelLogo,
  Epg,
  Layout,
  Program,
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
import React, { MouseEventHandler, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Modal, Paper, Space, Text, Tooltip, useMantineColorScheme } from '@mantine/core';

import ApplicationLayout from '../../layouts/Application';
import { EPGProgram } from '../../models/epg-program';
import { AppSliceState } from '../../store/app-slice';
import { parseDateString } from '../../utils/channels';

interface ChannelItemProps {
  onClick: () => void;
  channel: Channel;
}

const ProgramItem = ({ onClick, program, ...rest }: ProgramItem & { onClick: Function }) => {
  const { styles, formatTime, isLive, isMinWidth } = useProgram({ program, ...rest });

  const { data } = program;
  const { title, since, till } = data;

  const sinceTime = formatTime(since);
  const tillTime = formatTime(till);

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
};

const ChannelItem = ({ channel, onClick }: ChannelItemProps) => {
  const { position, logo } = channel;
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
};

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

// const findEPGData = (channel: any, epgData: { channels: any[]; programs: any[] }): any => {
//   const epgChannelMeta = epgData.channels.find(
//       (epgChannel: any) => epgChannel.name
//           .toLowerCase()
//           .slice(0, 4) === channel.channelName.toLowerCase().slice(0, 4)
//   );
//   return {
//     // program: epgProgramMeta ? formatProgram(epgChannelMeta) : null,
//     ...channel,
//     ...epgChannelMeta,
//   };
// };

const ChannelsPage: NextPage = () => {
  const channelList = useSelector((state: { app: AppSliceState }) => state.app.channelList);
  const egp = useSelector((state: { app: AppSliceState }) => state.app.egpData);
  // const softwareInfo = useSelector((state: { app: AppSliceState }) => state.app.softwareInfo);

  // const dispatch = useDispatch();

  // const {
  //   data: epgData,
  //   isLoading: isLoadingEpgData,
  //   isError: isEpgDataError,
  // } = useEGP(softwareInfo ? (softwareInfo as any).country.toLowerCase() : 'hu');
  // if (!isLoadingEpgData && !isEpgDataError) {
  //   dispatch(appActions.setEgpData(epgData));
  // }

  const { colorScheme } = useMantineColorScheme();

  const [programModalOpen, setProgramModalOpen] = React.useState(false);
  const [selectedProgram, setSelectedProgram] = React.useState<ProgramItem | null>(null);

  // const egpData = egp.programs.map((program: any) => ({
  //   ...program,
  //   channelUuid: egp.channels.find((channel: any) => channel.id === program.channel).channelUuid,
  //   since: new Date(program.start),
  //   till: new Date(program.stop),
  //   title: program.titles[0].value,
  //   description: program.descriptions.length > 0 ? program.descriptions[0].value : '',
  // }));
  // console.log(egpData);
  //
  // // TODO! It is VERY important to improve this filtering logic as soon as possible.
  // const channelsData = useMemo(
  //   () =>
  //     (channelList as any).channelList
  //       .map((channel: any) => findEPGData(channel, egp))
  //       .sort((a: any, b: any) => b.logo && !a.logo)
  //       .sort((a: any, b: any) => a.name > b.name),
  //   []
  // );
  // console.log(channelsData);

  // const egpData = channelsData
  //   .filter((channel: any) => channel.program)
  //   .map((channel: any) => channel.program);
  //
  // console.log(channelsData);
  const channelsData = useMemo(
    () =>
      egp.tv.channel
        .map((channel: any) => ({
          ...channel,
          uuid: channel.id,
        }))
        .filter((channel: any) =>
          (channelList as any).channelList.find((existingChannel: any) => {
            if (
              channel.displayName.toLowerCase().startsWith(
                existingChannel.channelName
                  .toLowerCase()
                  .replace('ö', 'o')
                  .replace('ü', 'u')
                  .replace('ó', 'o')
                  .replace('ő', 'o')
                  .replace('ú', 'u')
                  .replace('é', 'e')
                  .replace('á', 'a')
                  .replace('ű', 'u')
                  .replace('í', 'i')
                  .slice(0, Math.max(existingChannel.channelName.length - 1, 1))
              ) ||
              existingChannel.channelName
                .toLowerCase()
                .replace('ö', 'o')
                .replace('ü', 'u')
                .replace('ó', 'o')
                .replace('ő', 'o')
                .replace('ú', 'u')
                .replace('é', 'e')
                .replace('á', 'a')
                .replace('ű', 'u')
                .replace('í', 'i')
                .startsWith(
                  channel.displayName
                    .toLowerCase()
                    .slice(0, Math.max(channel.displayName.length - 1, 1))
                )
            ) {
              return true;
            }
            console.log(
              `Did not match: ${channel.displayName.toLowerCase()} and ${existingChannel.channelName.toLowerCase()}`
            );
            return false;
          })
        ),
    []
  );
  // const egpData = channelsData
  //   .filter((channel: any) => channel.program)
  //   .map((channel: any) => channel.program);
  // console.log(egpData);
  // console.log(channelsData);

  const egpData = egp.tv.programme.map((program: EPGProgram) => ({
    ...program,
    id: '',
    image: '',
    channelUuid: egp.tv.channel.find((channel: any) => channel.id === program.channel)?.id ?? '',
    since: parseDateString(program.start),
    till: parseDateString(program.stop),
    title: program.title.text,
    description: program.desc ?? '',
  })) as Program[];

  console.log(egpData);

  const { getEpgProps, getLayoutProps } = useEpg({
    theme: colorScheme === 'dark' ? darkTheme : lightTheme,
    epg: egpData,
    channels: channelsData,
    startDate: new Date(new Date().setHours(0, 0, 0, 0)), // or 2022-02-02T00:00:00
  });

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

  const handleProgramClick = (program: ProgramItem | null) => {
    console.log(program);
    setSelectedProgram(program);
    setProgramModalOpen(true);
  };

  return (
    <ApplicationLayout>
      {/* <MultiSelect
        placeholder="Filter Channels"
        itemComponent={SelectItem}
        data={channelsData}
        searchable
        nothingFound="No such channel"
        maxDropdownHeight={400}
        filter={(value, selected, item) =>
          !selected &&
          (item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.description.toLowerCase().includes(value.toLowerCase().trim()))
        }
      /> */}
      <Modal
        opened={programModalOpen}
        onClose={() => setProgramModalOpen(false)}
        title="Program details"
      >
        {selectedProgram && (
          <>
            <Text>{(selectedProgram as any).data.title.text}</Text>
            <Text>{(selectedProgram as any).data.desc?.text}</Text>
          </>
        )}
      </Modal>

      <Space h="md" />
      <Paper style={{ maxWidth: '87vw' }}>
        <Epg {...getEpgProps()}>
          <Layout
            {...getLayoutProps()}
            renderChannel={({ channel }) => (
              <ChannelItem
                onClick={() => setChannel(channel.channelId)}
                key={channel.uuid}
                channel={channel}
              />
            )}
            renderProgram={({ program, ...rest }) =>
              program && (
                <ProgramItem
                  onClick={() => handleProgramClick(program as any)}
                  key={program.data.id}
                  program={program}
                  {...rest}
                />
              )
            }
          />
        </Epg>
      </Paper>
    </ApplicationLayout>
  );
};

export default ChannelsPage;
