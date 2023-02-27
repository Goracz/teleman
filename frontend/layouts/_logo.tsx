import React from 'react';
import Image from 'next/image';
import logo from '../public/images/teleman_logo_3_transparent.png';

export const Logo = (props: any) => <Image {...props} src={logo} />;
