import { cva } from 'class-variance-authority';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { useActive } from '../../../hooks/active';

export interface ButtonProps {
    title: string;
    link?: string;
    active?: boolean;
    className?: string
    variant?: 'default' | 'action';
};

const outerStyles = cva(
    [
        'font-medium transition duration-100',
    ],
    {
        variants: {
            active: {
                true: 'border-0 bg-accent text-white',
                false: '',
            },
            variant: {
                default: [
                    'px-4 py-0.5 font-medium text-lg cursor-pointer',
                ],
                action: [
                    'px-1 py-1.5 font-medium text-md cursor-pointer bg-black text-white focus:outline-dotted'
                ],
            },
        },
        defaultVariants: {
            active: false,
            variant: 'default',
        },
    },
);

const innerStyles = cva(
    [],
    {
        variants: {
            active: {
                true: '',
                false: 'border-b-4 border-black',
            },
        },
    }
);

const Button: React.FC<ButtonProps> = memo(({ title, link, variant, className, ...props }: ButtonProps) => {
    const active = link ? (props.active || useActive(link)) : false;

    return (
        <>
            <div className={`${outerStyles({ active, variant })} ${className}`} {...props}>
                {link && (
                    <Link to={link} className={innerStyles({ active })}>
                        {title}
                    </Link>
                )}
                {!link && (
                    <span>{title}</span>
                )}
            </div>
        </>
    );
});

export default Button;
