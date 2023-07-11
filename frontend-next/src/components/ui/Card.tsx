import { cva } from 'class-variance-authority';
import { memo } from 'react';
import styled from 'styled-components';

import { useLowerLeft, useLowerRight, useUpperLeft, useUpperRight } from '../../hooks/active';

const UpperLeft: React.FC<CardProps> = ({ children, ...props }) => {
    return (
        <>
            <div {...props}>{children}</div>
        </>
    );
};

const UpperRight: React.FC<CardProps> = ({ children, ...props }) => {
    return (
        <>
            <div {...props}>{children}</div>
        </>
    );
};

const LowerLeft: React.FC<CardProps> = ({ children, ...props }) => {
    return (
        <>
            <div {...props}>{children}</div>
        </>
    );
};

const LowerRight: React.FC<CardProps> = ({ children, ...props }) => {
    return (
        <>
            <div {...props}>{children}</div>
        </>
    );
};

const Title: React.FC<CardProps> = memo(({ children, ...props }) => {
    return (
        <>
            <span className='text-xl font-bold' {...props}>{children}</span>
        </>
    );
});

const subtitleStyles = cva(
    ['font-medium'],
    {
        variants: {
            size: {
                md: 'text-xl',
                lg: 'text-2xl',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

interface SubtitleProps {
    children?: React.ReactNode;
    size: 'md' | 'lg';
    className?: string;
    [prop: string]: any;
}

const Subtitle: React.FC<SubtitleProps> = memo(({ children, size, className, ...props }) => {
    return (
        <>
            <span className={`${subtitleStyles({ size })} ${className}`} {...props}>{children}</span>
        </>
    );
});

interface CardProps {
    children?: React.ReactNode;
    size?: 'md' | 'lg' | 'full';
    decorationColor?: string;
    stickyDecoration?: boolean;
    active?: boolean;
    onClick?: () => void;
    [key: string]: any;
}

interface StaticCardProps {
    UpperLeft: React.ComponentType<CardProps>;
    UpperRight: React.ComponentType<CardProps>;
    LowerLeft: React.ComponentType<CardProps>;
    LowerRight: React.ComponentType<CardProps>;
    Title: React.ComponentType<CardProps>;
    Subtitle: React.ComponentType<CardProps>;
}

const cardStyles = cva(
    ["card__thumbnail flex flex-grow flex-col columns-2 bg-white"],
    {
        variants: {
            size: {
                md: 'h-36',
                lg: 'h-44',
                full: 'h-full',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

const UnstyledCard: React.FC<CardProps> = ({ children, size, className, onClick, ...props }) => {
    const upperLeft = useUpperLeft(children);
    const upperRight = useUpperRight(children);
    const lowerLeft = useLowerLeft(children);
    const lowerRight = useLowerRight(children);

    return (
        <>
            <div className={`card__wrapper ${className}`} onClick={onClick}>
                <div className="card flex flex-grow" id='card1'>
                    <div className={cardStyles({ size })} {...props}>
                        <div className="h-full flex flex-col justify-between">
                            <div className='grid place-self-start pt-3 px-4 overflow-x-visible whitespace-nowrap'>
                                {upperLeft}
                            </div>
                            <div className='grid place-self-start pb-3 px-4 overflow-x-visible whitespace-nowrap'>
                                {lowerLeft}
                            </div>
                        </div>
                        <div className="h-full flex flex-col justify-between">
                            <div className='grid place-self-end pt-3 px-4 overflow-x-visible whitespace-nowrap'>
                                {upperRight}
                            </div>
                            <div className='grid place-self-end pb-2.5 px-4 overflow-x-visible whitespace-nowrap'>
                                {lowerRight}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const UnstyledRawCard: React.FC<CardProps> = ({ children, size, className, onClick, ...props }) => {
    return (
        <>
            <div className={`card__wrapper ${className}`} onClick={onClick}>
                <div className="card flex flex-grow" id='card1'>
                    <div className={cardStyles({ size })} {...props}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

const StyledCard = styled(UnstyledCard)`
    #card1 {
        background-color: ${props => props.decorationColor || 'black'};

        &:after,
        &:before {
            background-color: ${props => props.decorationColor || 'black'};
        }
    }

    .card {
        position: relative;

        .card__thumbnail {
            display: block;
            aspect-ratio: 4 / 3;
            transition: all .15s ease;
            position: relative;
            z-index: 10;
            transform: ${props => props.active ? 'translate(15px, -15px)' : 'none'};
            border: ${props => props.active ? '4px solid black' : 'none'};
        }

        &:after,
        &:before {
            position: absolute;
            content: '';
            height: 0px;
            width: 0px;
            transition: all .15s ease;
        }

        &:after {
            top: 0;
            left: 0;
            transform-origin: top left;
            transform: ${props => props.active ? 'rotate(-45deg) scale(1)' : 'rotate(-45deg) scale(0)'};
        }

        &:before {
            right: 0;
            bottom: 0;
            transform-origin: bottom right;
            transform: ${props => props.active ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)'};
        }

        ${props => !props.stickyDecoration && `
            &:hover {
                &:after {
                    transform: ${props.active ? 'rotate(-45deg) scale(0)' : 'rotate(-45deg) scale(1)'};
                }

                &:before {
                    transform: ${props.active ? 'rotate(45deg) scale(0)' : 'rotate(45deg) scale(1)'};
                }

                .card__thumbnail {
                    transform: ${props.active ? 'translate(0, 0)' : 'translate(15px, -15px)'};
                    border: ${props.active ? 'none' : '4px solid black'};
                }
            }
        `}
    }
`;

const StyledRawCard = styled(UnstyledRawCard)`
    #card1 {
        background-color: ${props => props.decorationColor || 'black'};

        &:after,
        &:before {
            background-color: ${props => props.decorationColor || 'black'};
        }
    }

    .card {
        position: relative;

        .card__thumbnail {
            aspect-ratio: 4 / 3;
            transition: all .15s ease;
            position: relative;
            z-index: 10;
            transform: ${props => props.active ? 'translate(15px, -15px)' : 'none'};
            border: ${props => props.active ? '4px solid black' : 'none'};
        }

        &:after,
        &:before {
            position: absolute;
            content: '';
            height: 0px;
            width: 0px;
            transition: all .15s ease;
        }

        &:after {
            top: 0;
            left: 0;
            transform-origin: top left;
            transform: ${props => props.active ? 'rotate(-45deg) scale(1)' : 'rotate(-45deg) scale(0)'};
        }

        &:before {
            right: 0;
            bottom: 0;
            transform-origin: bottom right;
            transform: ${props => props.active ? 'rotate(45deg) scale(1)' : 'rotate(45deg) scale(0)'};
        }

        ${props => !props.stickyDecoration && `
            &:hover {
                &:after {
                    transform: ${props.active ? 'rotate(-45deg) scale(0)' : 'rotate(-45deg) scale(1)'};
                }

                &:before {
                    transform: ${props.active ? 'rotate(45deg) scale(0)' : 'rotate(45deg) scale(1)'};
                }

                .card__thumbnail {
                    transform: ${props.active ? 'translate(0, 0)' : 'translate(15px, -15px)'};
                    border: ${props.active ? 'none' : '4px solid black'};
                }
            }
        `}
    }
`;

const Card: React.FC<CardProps> & StaticCardProps = ({ ...props }) => <StyledCard {...props} />;
export const RawCard: React.FC<CardProps> = ({ ...props }) => <StyledRawCard {...props} />;

Card.UpperLeft = UpperLeft;
Card.UpperRight = UpperRight;
Card.LowerLeft = LowerLeft;
Card.LowerRight = LowerRight;
Card.Title = Title;
Card.Subtitle = Subtitle;

export default Card;
