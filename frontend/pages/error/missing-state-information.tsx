import { createStyles, Container, Title, Text, Button, SimpleGrid } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import Lottie from 'lottie-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ApplicationLayout from '../../layouts/Application';
import tvAnimation from '../../public/lottie/tv.json';
import { AppSliceState } from '../../store/app-slice';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

const onlinePowerStates = ['Active', 'Active Standby'];

const TurnTvOnPage: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const powerState = useSelector((state: { app: AppSliceState }) => state.app.powerState);

  let isLoadingTvStateToggle = false;
  let isTvStateToggleError;

  const handleToggleTvState = async () => {
    isLoadingTvStateToggle = true;
    const desiredState: 'on' | 'off' = !['Active Standby', 'Suspend'].includes(powerState.state)
      ? 'off'
      : 'on';

    const result = await fetch(`http://localhost:8080/api/v1/system/power/${desiredState}`, {
      method: 'post',
    });
    isLoadingTvStateToggle = false;
    isTvStateToggleError = !result.ok;

    if (!isTvStateToggleError) {
      showNotification({
        color: 'teal',
        title: 'Success',
        message: `LG C2 has been turned ${desiredState}.`,
        icon: <IconCheck size={16} />,
      });
    } else {
      showNotification({
        color: 'red',
        title: 'Error',
        message: `Could not turn ${desiredState} LG TV.`,
        icon: <IconX size={16} />,
      });
    }
  };

  useEffect(() => {
    if (powerState && onlinePowerStates.includes(powerState.state)) {
      router.push('/dashboard');
    }
  }, [powerState]);

  return (
    <ApplicationLayout>
      <Container className={classes.root}>
        <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
          <Lottie animationData={tvAnimation} loop className={classes.mobileImage} />
          <div>
            <Title className={classes.title}>
              You have to turn On your TV before using the application.
            </Title>
            <Text color="dimmed" size="lg">
              Mandatory state information is missing that is required for the application to
              function. Please turn on your TV in order to hydrate the application with the required
              data.
            </Text>
            <Button
              loading={isLoadingTvStateToggle}
              disabled={!powerState}
              variant="outline"
              size="md"
              mt="xl"
              onClick={handleToggleTvState}
              className={classes.control}
            >
              Try turning on via Teleman
            </Button>
          </div>
          <Lottie animationData={tvAnimation} loop className={classes.desktopImage} />
        </SimpleGrid>
      </Container>
    </ApplicationLayout>
  );
};

export default TurnTvOnPage;
