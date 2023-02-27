import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  });

  return <></>;
};

export default HomePage;
