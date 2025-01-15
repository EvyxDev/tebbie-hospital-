import { loader } from "../assets";

const LoaderComponent = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <img alt="loader" className="w-56" src={loader} />
    </div>
  );
};

export default LoaderComponent;
