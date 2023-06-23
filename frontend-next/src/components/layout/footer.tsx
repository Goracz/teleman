interface MenuItem {
    title: string;
    link: string;
}

interface FooterProps {
    menuItems?: MenuItem[];
}

const Footer: React.FC<FooterProps> = ({ menuItems }: FooterProps) => {
    return (
        <>
            <div className="w-screen border-black border-4 px-5 py-3 text-center">
                <span className="text-xl font-bold">Teleman v2023.6.24</span>
                {menuItems?.map((item) => (
                    <span key={item.link}>{item.title}</span>
                ))}
            </div>
        </>
    );
};

export default Footer;
