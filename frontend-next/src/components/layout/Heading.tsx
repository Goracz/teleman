import { cva } from 'class-variance-authority';
import React, { memo } from 'react';

interface HeadingProps {
    title: string | number;
    decoration?: string;
    extraDecorationPath?: string;
    size?: 'sm' | 'md';
}

const containerStyles = cva(
    [
        'flex items-center'
    ],
    {
        variants: {
            size: {
                sm: "gap-1.5",
                md: "gap-4",
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

const decorationStyles = cva(
    [
        'rounded-full',
    ],
    {
        variants: {
            size: {
                sm: "p-4 m-1",
                md: "p-6 m-2",
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

const titleStyles = cva(
    [
        'font-bold',
    ],
    {
        variants: {
            size: {
                sm: "text-xl",
                md: "text-4xl",
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

const Heading: React.FC<HeadingProps> = memo(({ title, decoration: decorationColor, extraDecorationPath, size }) => {
    const classes = decorationStyles({ size }) + ' ' + decorationColor;

    return (
        <>
            <div className="flex flex-row">
                <div className={containerStyles({ size })}>
                    {decorationColor && <div className={classes}></div>}
                    <span className={titleStyles({ size })}>{title}</span>
                </div>
            </div>
            <div className="flex flex-row">
                <img src={extraDecorationPath} />
            </div>
        </>
    );
});

export default Heading;
