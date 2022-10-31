import { Col, Grid, Group, Paper, Space, Text, Image } from '@mantine/core';
import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import ApplicationLayout from '../../layouts/Application';

const ChannelsPage: NextPage = () => {
  const channelList = useSelector((state: any) => state.app.channelList);

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

  return (
    <ApplicationLayout>
      <Grid>
        {channelList &&
          channelList.channelList.map((channel: any) => (
            <Col
              key={channel.channelName}
              sm={12}
              md={6}
              lg={2}
              onClick={() => setChannel(channel.channelId)}
            >
              <Paper withBorder radius="md" p="md">
                <Group align="center">
                  <Image width="3vw" height="4vh" src={channel.imgUrl} />
                  <Text>{channel.channelName}</Text>
                </Group>
                <Text hidden size="sm">
                  {channel.channelType} - {channel.channelNumber}
                </Text>
                <Space h="sm" />
                <Group>
                  <Text hidden size="sm">
                    View Programme
                  </Text>
                  <Text hidden size="sm">
                    Technical Information
                  </Text>
                </Group>
              </Paper>
            </Col>
          ))}
      </Grid>
    </ApplicationLayout>
  );
};

export default ChannelsPage;
