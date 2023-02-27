import { Button, ButtonProps, Group } from '@mantine/core';
import { GithubIcon, DiscordIcon, TwitterIcon } from '@mantine/ds';
import { GoogleIcon } from './GoogleIcon';
import { FacebookIcon } from './FacebookIcon';

export const GoogleButton = (props: ButtonProps) => (
  <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />
);

export const FacebookButton = (props: ButtonProps) => (
  <Button
    leftIcon={<FacebookIcon />}
    sx={(theme) => ({
      backgroundColor: '#4267B2',
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.fn.darken('#4267B2', 0.1),
      },
    })}
    {...props}
  />
);

export const DiscordButton = (props: ButtonProps) => (
  <Button
    leftIcon={<DiscordIcon size={16} />}
    sx={(theme) => ({
      backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.lighten('#5865F2', 0.05)
            : theme.fn.darken('#5865F2', 0.05),
      },
    })}
    {...props}
  />
);

// Twitter button as anchor
export const TwitterButton = (props: ButtonProps & React.ComponentPropsWithoutRef<'a'>) => (
  <Button
    component="a"
    leftIcon={<TwitterIcon size={16} color="#00ACEE" />}
    variant="default"
    {...props}
  />
);

export const GithubButton = (props: ButtonProps) => (
  <Button
    {...props}
    leftIcon={<GithubIcon size={16} />}
    sx={(theme) => ({
      backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
      color: '#fff',
      '&:hover': {
        backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
      },
    })}
  />
);

export const SocialButtons = () => (
  <Group position="center" sx={{ padding: 15 }}>
    <GoogleButton>Continue with Google</GoogleButton>
    <TwitterButton href="https://twitter.com/mantinedev" target="_blank">
      Follow on Twitter
    </TwitterButton>
    <FacebookButton>Sign in with Facebook</FacebookButton>
    <GithubButton>Login with GitHub</GithubButton>
    <DiscordButton>Join Discord community</DiscordButton>
  </Group>
);
