import { Card, Col, Grid, Group, Image, Text } from '@mantine/core';
import React, { memo } from 'react';
import { NextPage } from 'next';
import { LaunchPoint } from '../../models/launch-point';
import { useLaunchApp } from '../../hooks';

export interface QuickAppLauncherProps {
  launchPoints: LaunchPoint[];
}

const QuickAppLauncher: NextPage<QuickAppLauncherProps> = memo(({ launchPoints }) => (
  <Card style={{ minHeight: '25.5vh' }} shadow="md" radius="xl" p="xs">
    <Text mt={6} ml={12} weight={500}>
      Quick App Launch
    </Text>
    <Grid columns={4} p={20}>
      {launchPoints &&
        launchPoints
          .filter((launchPoint: LaunchPoint, index: number) => index <= 7)
          .map((application) => (
            <Col
              xl={1}
              lg={2}
              md={1}
              sm={2}
              xs={1}
              p={20}
              key={application.id}
              onClick={() => useLaunchApp(application)}
            >
              <Card withBorder style={{ height: '8vh', cursor: 'pointer' }} radius="lg" shadow="xs">
                <Group px={20} pb={10} position="apart" style={{ height: '100%' }}>
                  <Image width="2vw" alt={application.title} src={application.largeIcon} />
                  <Text weight={500}>{application.title}</Text>
                </Group>
              </Card>
            </Col>
          ))}
    </Grid>
  </Card>
));

export default QuickAppLauncher;
