import { Link } from "react-router-dom";

export default function ErrorPage(){

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-20 w-56 items-center justify-center gap-5 rounded-2xl bg-white bg-opacity-90 drop-shadow-md">
        <Link
          to="/"
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <p className="font-semibold text-lg">❌ Invalid Access</p>
          <p className="font-light">Click to go to the main screen</p>
        </Link>
      </div>
    </div>
  );
}