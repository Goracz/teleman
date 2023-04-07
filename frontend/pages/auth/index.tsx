import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import {
  Anchor,
  Button,
  Card,
  CardProps,
  Checkbox,
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { GoogleButton, TwitterButton } from '../../components/SocialButtons/SocialButtons';
import { useLogin, useRegister } from '../../hooks/auth';

// @ts-ignore
const LoginPage: NextPage = (props: CardProps) => {
  const router = useRouter();

  const [type, toggle] = useToggle(['login', 'register']);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 4 ? 'Password should include at least 4 characters' : null),
    },
  });

  const handleSubmit = async () => {
    if (!form.isValid) return;

    setIsLoading(true);
    const { email, password, firstName, lastName } = form.values;
    if (type === 'login') {
      const token = await useLogin({ email, password });
      if (!token) {
        showNotification({
          color: 'red',
          title: 'Failed to log in',
          message: 'The provided email or password is incorrect',
          icon: <IconCheck size={16} />,
        });
        return;
      }
      localStorage.setItem('token', token);
      await router.replace('/dashboard');
    } else if (type === 'register') {
      const registrationResult = await useRegister({
        email,
        password,
        firstName,
        lastName,
      });
      if (registrationResult) {
        showNotification({
          color: 'blue',
          title: 'Registration successful',
          message: 'You can now log in',
          icon: <IconCheck size={16} />,
        });
        toggle();
        form.reset();
      } else {
        showNotification({
          color: 'red',
          title: 'Registration failed',
          message: 'Failed to register',
          icon: <IconCheck size={16} />,
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <Container size={420} my={120}>
      <Card radius="xl" p="xl" shadow="xl" {...props}>
        <Text size="lg" weight={500}>
          Welcome to Teleman, {type} with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            <TextInput
              radius="xl"
              required
              label="Email"
              placeholder="Your email"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
            />
            <PasswordInput
              required
              radius="xl"
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
            />
            {type === 'register' && (
              <TextInput
                radius="xl"
                label="First name"
                placeholder="Your first name"
                value={form.values.firstName}
                onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
              />
            )}
            {type === 'register' && (
              <TextInput
                radius="xl"
                label="Last name"
                placeholder="Your last name"
                value={form.values.lastName}
                onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
              />
            )}

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button
              loading={isLoading}
              radius="xl"
              type="submit"
              disabled={type === 'register' && !form.values.terms}
              onClick={handleSubmit}
            >
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
};

export default LoginPage;
