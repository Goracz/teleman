const Footer: React.FC = () => {
    return (
        <>
            <div className="w-screen border-black border-4 px-5 py-4 text-center flex flex-col items-center relative">
                <div>
                    <span className="text-xl font-bold">Teleman v2023.6.24</span>
                </div>
                <div className="absolute top-10">
                    <img src="/footer-decoration.svg" />
                </div>
            </div>
        </>
    );
};

export default Footer;
