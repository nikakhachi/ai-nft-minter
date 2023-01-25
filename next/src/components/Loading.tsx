import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="w-full flex justify-center mt-14">
      <CircularProgress color="error" />
    </div>
  );
};

export default Loading;
