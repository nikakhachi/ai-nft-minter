const IncorrectNetwork = () => {
  return (
    <div className="container mx-auto mt-2 pb-14">
      <div className="flex w-full justify-center flex-col">
        <div className="flex flex-col items-center justify-center">
          <img src="mona.png" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-white text-xl md:text-3xl font-[Courier] my-5 md:my-12">
            Please switch the network to <span className="underline italic">GOERLI</span> and refresh this page
          </p>
          <button
            onClick={() => window.location.reload()}
            type="submit"
            className="mt-12 w-96 border-2 border-[#fe5cb8] text-white font-[Courier] duration-500 px-6 py-2 rounded flex justify-center items-center h-10"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncorrectNetwork;
