import {
  Button,
  Container,
  createStyles,
  SimpleGrid,
  Space,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import Lottie from 'lottie-react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ApplicationLayout from '../../layouts/Application';
import tvAnimation from '../../public/lottie/tv.json';
import { appActions } from '../../store/app-slice';
import { useSystemPower } from '../../hooks';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,

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
  const dispatch = useDispatch();

  const {
    data: powerState,
    isLoading: isLoadingPowerState,
    isError: isPowerStateError,
  } = useSystemPower();
  if (!isLoadingPowerState && !isPowerStateError) {
    dispatch(appActions.setPowerState(powerState));
  }

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
            <Space h="md" />
            <Text color="dimmed" size="md">
              Reason: Reason of why the user has been redirected to this page (what kind of state
              information is missing)...
            </Text>
            <Space h="md" />
            <Text color="dimmed" size="sm">
              Tip: This usually happens when you try to use the application for the first time, or
              when you restart the components of the application.
            </Text>
            <Tooltip
              label={
                !powerState
                  ? 'There is no connection to the TV - it cannot be turned on from the application'
                  : 'The application has an indirect connection to the TV - click to turn it on'
              }
            >
              <Button
                loading={isLoadingTvStateToggle}
                disabled={!powerState}
                variant="light"
                size="md"
                mt="xl"
                radius="xl"
                onClick={handleToggleTvState}
                className={classes.control}
              >
                Try turning on via Teleman
              </Button>
            </Tooltip>
          </div>
          <Lottie animationData={tvAnimation} loop className={classes.desktopImage} />
        </SimpleGrid>
      </Container>
    </ApplicationLayout>
  );
};

export default TurnTvOnPage;
