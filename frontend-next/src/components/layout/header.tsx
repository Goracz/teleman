import { memo, useEffect, useRef } from 'react';

import Button, { ButtonProps } from './MenuButton/MenuButton';

interface HeaderProps {
    menuItems?: ButtonProps[];
    onHeightChange: (height: number) => void;
}

const Header: React.FC<HeaderProps> = memo(({ menuItems, onHeightChange }) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            onHeightChange(ref.current.offsetHeight);
        }
    }, []);

    return (
        <>
            <div ref={ref} className="flex-none w-screen border-black border-4 px-5 py-3">
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-5">
                        <span className="text-4xl font-black mr-8">Teleman</span>
                            {menuItems?.map((item) => (
                                <Button key={item.link} title={item.title} link={item.link} />
                            ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-5">
                            <Button title="Connected" link="#" active />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Header;
