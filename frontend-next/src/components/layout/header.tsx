import MenuButton, { MenuButtonProps } from './MenuButton/MenuButton';

interface HeaderProps {
    menuItems?: MenuButtonProps[];
}

const Header: React.FC<HeaderProps> = ({ menuItems }: HeaderProps) => {
    return (
        <>
            <div className="w-screen border-black border-4 px-5 py-3">
                <div className='flex justify-between items-center'>
                    <div className="flex items-center gap-5">
                        <span className="text-4xl font-black mr-8">Teleman</span>
                            {menuItems?.map((item) => (
                                <MenuButton key={item.link} title={item.title} link={item.link} />
                            ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-5">
                            <MenuButton title="Connected" link="#" active />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
