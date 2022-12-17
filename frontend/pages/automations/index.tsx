import {
  Text,
  Button,
  Container,
  createStyles,
  SimpleGrid,
  Title,
  Drawer,
  Select,
  Space,
  Grid,
  Col,
  NumberInput,
  Divider,
  Input,
  Stack,
  Group,
  Avatar,
  TextInput,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendar, IconClock } from '@tabler/icons';
import Lottie from 'lottie-react';
import { NextPage } from 'next';
import { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutomationCard } from '../../components/AutomationCard';
import { useAutomationRules } from '../../hooks';
import ApplicationLayout from '../../layouts/Application';
import { AutomationAction } from '../../models/automation-action';
import { AutomationActionType } from '../../models/automation-action-type';
import { AutomationRule } from '../../models/automation-rule';
import { AutomationScheduleKind } from '../../models/automation-schedule-kind';
import { Channel } from '../../models/channel';
import automationAnimation from '../../public/lottie/automation.json';
import { appActions, AppSliceState } from '../../store/app-slice';

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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  imgUrl: string;
  channelName: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ imgUrl, channelName, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={imgUrl} />

        <div>
          <Text>{channelName}</Text>
        </div>
      </Group>
    </div>
  )
);

const AutomationsPage: NextPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const channels = useSelector((state: { app: AppSliceState }) => state.app.channelList);
  const volume = useSelector((state: { app: AppSliceState }) => state.app.volume);

  const form = useForm({
    initialValues: {
      automationRule: {
        title: undefined,
        description: undefined,
        scheduleKind: undefined,
        cronExpression: undefined,
        executionTime: undefined,
        automationActions: [{} as any],
      },
    },
    validate: {
      automationRule: {
        title: (value: string | undefined) =>
          !(value && value.length > 0) ? 'Title is required' : null,
        scheduleKind: (value) =>
          !value ||
          (value &&
            ![AutomationScheduleKind.DATE_TIME, AutomationScheduleKind.CRON].includes(value))
            ? 'Invalid schedule kind'
            : null,
        automationActions: {
          type: (value) =>
            ![
              AutomationActionType.TurnOn.valueOf().toString(),
              AutomationActionType.TurnOff.valueOf().toString(),
              AutomationActionType.SetVolume.valueOf().toString(),
              AutomationActionType.SetChannel.valueOf().toString(),
              AutomationActionType.OpenApplication.valueOf().toString(),
            ].includes(value)
              ? 'Invalid automation type'
              : null,
        },
      },
    },
  });

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [isLoadingAutomationRuleSubmission, setIsLoadingAutomationRuleSubmission] = useState(false);

  const {
    data: automations,
    isLoading: isLoadingAutomations,
    isError: isAutomationsError,
  } = useAutomationRules();
  if (!isLoadingAutomations && !isAutomationsError) {
    dispatch(appActions.setAutomationRules(automations));
  }

  const presentAddAutomationDrawer = (): void => {
    setDrawerOpened(true);
  };

  const handleAddAutomationAction = (): void => {
    form.values.automationRule.automationActions.push({});
  };
  const handleRemoveAutomationAction = (index: number): void => {
    form.values.automationRule.automationActions.splice(index, 1);
  };
  const handleAddAutomationRule = async (): Promise<void> => {
    setIsLoadingAutomationRuleSubmission(true);
    const automationRule: AutomationRule = {
      title: form.values.automationRule.title as unknown as string,
      description: form.values.automationRule.description || undefined,
      actions: form.values.automationRule.automationActions,
      scheduleKind: form.values.automationRule.scheduleKind as unknown as AutomationScheduleKind,
      cronSchedule:
        form.values.automationRule.scheduleKind === AutomationScheduleKind.CRON
          ? form.values.automationRule.cronExpression
          : undefined,
      executionTime:
        form.values.automationRule.scheduleKind === AutomationScheduleKind.DATE_TIME
          ? form.values.automationRule.executionTime
          : undefined,
    };
    const response = await fetch('http://localhost:8083/api/v1/automations', {
      method: 'POST',
      body: JSON.stringify(automationRule),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) setDrawerOpened(false);
    setIsLoadingAutomationRuleSubmission(false);
  };

  const handleCloseDrawer = () => {
    form.reset();
    setDrawerOpened(false);
  };

  useEffect(() => {
    (channels as any).channelList.map((channel: Channel) => ({
      ...channels,
      value: channel.channelId,
    }));
  }, [channels]);

  return (
    <ApplicationLayout>
      <Drawer
        opened={drawerOpened}
        onClose={handleCloseDrawer}
        title="Create an Automation Rule"
        padding="xl"
        size="xl"
      >
        <Stack>
          <TextInput
            required
            label="Title"
            placeholder="Title of the Rule"
            {...form.getInputProps('automationRule.title')}
          />
          <TextInput
            label="Description"
            placeholder="Description of the Rule"
            {...form.getInputProps('automationRule.description')}
          />
          <Select
            required
            label="Schedule Kind"
            placeholder="Pick a Schedule Kind"
            data={[
              { value: AutomationScheduleKind.DATE_TIME, label: 'Date Time' },
              { value: AutomationScheduleKind.CRON, label: 'Cron' },
            ]}
            {...form.getInputProps('automationRule.scheduleKind')}
          />
          {form.values.automationRule.scheduleKind === 0 && (
            <Grid columns={2}>
              <Col lg={1}>
                <DatePicker
                  required
                  placeholder="Pick date"
                  label="Job execution date"
                  minDate={new Date()}
                  icon={<IconCalendar size={16} />}
                  {...form.getInputProps('automationRule.executionTimeDate')}
                />
              </Col>
              <Col lg={1}>
                <TimeInput
                  required
                  placeholder="Pick time"
                  label="Job execution time"
                  icon={<IconClock size={16} />}
                  defaultValue={new Date()}
                  {...form.getInputProps('automationRule.executionTime')}
                />
              </Col>
            </Grid>
          )}
          {form.values.automationRule.scheduleKind === 1 && (
            <Input.Wrapper
              id="automation-rule-cron-expression"
              withAsterisk
              label="Cron Expression"
              description="The automation rule's scheduling will be based on the given Cron Expression. Non-standard format is also accepted."
              error={
                Object.prototype.hasOwnProperty.call(form.errors, 'automationRule')
                  ? (form.errors.automationRule as any).cronSchedule
                  : null
              }
            >
              <Input
                id="automation-rule-cron-expression"
                placeholder="Cron Expression"
                {...form.getInputProps('automationRule.cronExpression')}
              />
            </Input.Wrapper>
          )}
        </Stack>
        <Divider my={16} />
        {form.values.automationRule.automationActions.map(
          (action: AutomationAction, index: number) => (
            <>
              <Stack>
                <Select
                  required
                  label={`Automation Action ${index + 1}`}
                  placeholder="Pick an Action"
                  data={[
                    { value: AutomationActionType.TurnOn.valueOf().toString(), label: 'Turn On' },
                    { value: AutomationActionType.TurnOff.valueOf().toString(), label: 'Turn Off' },
                    {
                      value: AutomationActionType.SetVolume.valueOf().toString(),
                      label: 'Set Volume',
                    },
                    {
                      value: AutomationActionType.SetChannel.valueOf().toString(),
                      label: 'Set Channel',
                    },
                    {
                      value: AutomationActionType.OpenApplication.valueOf().toString(),
                      label: 'Open Application',
                    },
                  ]}
                  {...form.getInputProps(`automationRule.automationActions.${index}.type`)}
                />
                {(action.type as unknown as string) ===
                  AutomationActionType.SetVolume.valueOf().toString() && (
                  <NumberInput
                    defaultValue={volume > -1 ? volume : 6}
                    placeholder="Desired TV Volume"
                    label="Volume"
                    withAsterisk
                    {...form.getInputProps(`automationRule.automationActions.${index}.volume`)}
                  />
                )}
                {(action.type as unknown as string) ===
                  AutomationActionType.SetChannel.valueOf().toString() && (
                  <Select
                    placeholder="Channel to set"
                    itemComponent={SelectItem}
                    data={(channels as any).channelList}
                    nothingFound="No such channel"
                    maxDropdownHeight={400}
                    filter={(value: string, selected: any, item: { channelName: string }) =>
                      !selected &&
                      item.channelName.toLowerCase().includes(value.toLowerCase().trim())
                    }
                    {...form.getInputProps(`automationRule.automationActions.${index}.channelId`)}
                  />
                )}
              </Stack>
              {index > 0 && (
                <>
                  <Space h="md" />
                  <Button
                    onClick={() => handleRemoveAutomationAction(index)}
                    variant="light"
                    color="red"
                    size="xs"
                  >
                    Delete Action {index + 1}
                  </Button>
                </>
              )}
              <Space h="xl" />
            </>
          )
        )}
        <Grid columns={2}>
          <Col lg={1}>
            <Button variant="light" fullWidth onClick={handleAddAutomationAction}>
              Add Automation Action
            </Button>
          </Col>
          <Col lg={1}>
            <Button
              onClick={handleAddAutomationRule}
              loading={isLoadingAutomationRuleSubmission}
              disabled={!form.isValid()}
              fullWidth
            >
              Submit Automation Rule
            </Button>
          </Col>
        </Grid>
      </Drawer>

      {automations && automations.length === 0 && (
        <Container className={classes.root}>
          <SimpleGrid
            spacing={80}
            cols={2}
            breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}
          >
            <Lottie animationData={automationAnimation} loop className={classes.mobileImage} />
            <div>
              <Title className={classes.title}>
                You haven&apos;t created any Automation Rules yet.
              </Title>
              <Text color="dimmed" size="lg">
                You could use your TV as an alarm clock or set a timer to switch to your favorite
                programme when it starts.
              </Text>
              <Button
                loading={isLoadingAutomations}
                variant="outline"
                size="md"
                mt="xl"
                onClick={presentAddAutomationDrawer}
                className={classes.control}
              >
                Create an Automation Rule
              </Button>
            </div>
            <Lottie animationData={automationAnimation} loop className={classes.desktopImage} />
          </SimpleGrid>
        </Container>
      )}
      {automations && automations.length > 0 && (
        <>
          <Grid columns={1} mb={20}>
            <Col>
              <Button onClick={() => setDrawerOpened(true)} variant="outline">
                Add new Automation Rule
              </Button>
            </Col>
          </Grid>
          <Grid columns={12}>
            {automations.map((rule: AutomationRule) => (
              <Col sm={6} md={4} lg={3}>
                <AutomationCard
                  id={rule.id!}
                  title={rule.title}
                  description={rule.description || ''}
                  cronSchedule={rule.cronSchedule}
                  executionTime={rule.executionTime}
                  actions={rule.actions}
                />
              </Col>
            ))}
          </Grid>
        </>
      )}
    </ApplicationLayout>
  );
};

export default AutomationsPage;
