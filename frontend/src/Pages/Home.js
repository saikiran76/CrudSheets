import { Link } from "react-router-dom";
import { Button } from "../components/Button";

const Home = () => {
    return (
        <div className="container flex flex-col justify-center items-center p-4 shadow-md backdrop-blur-md bg-custom-gradient h-screen">
            <p className="font-bold italic font-cursive mb-1 text-base sm:text-lg md:text-xl lg:text-2xl">"Excels like Excel"</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 text-center">
                Spreadsheet<span className="ml-1 sm:ml-2 md:ml-3 text-[#910A67] font-cursive text-[2.5rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[4rem]">CRUD</span> Application
            </h1>
            <Link to="/sheet">
                <Button name={"Have a Look"} />
            </Link>
        </div>
    );
};

export default Home;

