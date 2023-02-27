import { Card, Col, Grid, Group, Image, Text } from '@mantine/core';
import React from 'react';

const applications = [
  {
    name: 'YouTube',
    package: '',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
  },
  {
    name: 'Spotify',
    package: '',
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png',
  },
  {
    name: 'Tidal',
    package: '',
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/tidal-512.png',
  },
  {
    name: 'Browser',
    package: '',
    iconUrl: 'https://www.freeiconspng.com/thumbs/www-icon/www-domain-icon-0.png',
  },
  {
    name: 'RTL+',
    package: '',
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/RTL%2B_Logo_2021.svg/2560px-RTL%2B_Logo_2021.svg.png',
  },
  {
    name: 'Twitch',
    package: '',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
  },
];

const QuickAppLauncher = () => (
  <Card style={{ minHeight: '25.5vh' }} shadow="md" radius="xl" p="xs">
    <Text mt={6} ml={12} weight={500}>
      Quick App Launch
    </Text>
    <Grid columns={4} p={20}>
      {applications.map((application) => (
        <Col xl={1} lg={2} md={1} sm={2} xs={1} p={20}>
          <Card withBorder style={{ height: '8vh', cursor: 'pointer' }} radius="lg" shadow="xs">
            <Group px={20} pb={10} position="apart" style={{ height: '100%' }}>
              <Image width="2vw" alt={application.name} src={application.iconUrl} />
              <Text weight={500}>{application.name}</Text>
            </Group>
          </Card>
        </Col>
      ))}
    </Grid>
  </Card>
);

export default QuickAppLauncher;
