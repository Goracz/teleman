import { Group, Skeleton } from '@mantine/core';
import React from 'react';
import { useViewportSize } from '@mantine/hooks';

const UptimeChartSkeleton = () => {
  const { width } = useViewportSize();

  return (
    <Group align="flex-end" position="center" p={20}>
      <Skeleton animate={false} height="20vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="11vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="14vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="17vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="12vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="15vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="15vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="15vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="11vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="14vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="17vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="14vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="12vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
      <Skeleton animate={false} height="13vh" width="1.5vw" radius="xl" />
      {width > 1800 && (
        <>
          <Skeleton animate={false} height="11vh" width="1.5vw" radius="xl" />
          <Skeleton animate={false} height="9vh" width="1.5vw" radius="xl" />
          <Skeleton animate={false} height="7vh" width="1.5vw" radius="xl" />
          <Skeleton animate={false} height="10vh" width="1.5vw" radius="xl" />
        </>
      )}
    </Group>
  );
};

export default UptimeChartSkeleton;
