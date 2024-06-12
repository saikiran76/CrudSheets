import { Link } from "react-router-dom";
import { Button } from "../components/Button";
const Home = () => {
    return (
        <div className="container flex flex-col justify-center items-center p-4 shadow-md backdrop-blur-md  bg-custom-gradient h-screen">
            <p className="font-bold italic font-cursive mb-1">"Excels like Excel"</p>
            <h1 className="text-[3.5rem] mb-3">Spreadsheet<span className="ml-3 text-[#910A67] font-cursive text-[4rem]">CRUD</span> Application</h1>
            <Link to="/sheet">
                {/* <button className="m-4 p-[0.75em] text-xl bg-black hover:bg-[#FEE4A4] hover:text-[#764A2D] duration-300 text-white rounded-lg font-bold">Have a Look</button> */}
                <Button name={"Have a Look"}/>
            </Link>
        </div>
    );
};

export default Home;
