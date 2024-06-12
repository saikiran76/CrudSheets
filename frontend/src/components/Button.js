export const Button = ({name, handler=()=>null}) =>{
    // const Handler = handler || (() => {});
    return(
        <button className="m-4 p-[0.75em] text-xl bg-black hover:bg-[#FEE4A4] hover:text-[#764A2D] duration-300 text-white rounded-lg font-bold" onClick={handler}>{name}</button>
    )
}