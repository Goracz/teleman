import { cva } from 'class-variance-authority';
import { Link } from 'react-router-dom';

import { useActive } from '../../../hooks/active';

export interface MenuButtonProps {
    title: string;
    link: string;
    active?: boolean;
}

const outerStyles = cva(
    [
        'font-medium',
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

const MenuButton: React.FC<MenuButtonProps> = ({ title, link, ...props }: MenuButtonProps) => {
    const active = props.active || useActive(link);

    return (
        <>
            <div className={outerStyles({ active })}>
                <Link to={link} className={innerStyles({ active })}>
                    {title}
                </Link>
            </div>
        </>
    );
};

export default MenuButton;
