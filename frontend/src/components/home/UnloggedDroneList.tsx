import { LoginForm } from "./LoginForm";

export default function UnloggedDroneList(){
  return (
    <>
      <div className="absolute h-full w-full bg-black bg-opacity-50 backdrop-blur-[2px]" id="unlogged-data-list"></div>
      <div className="mx-auto mb-10 mt-10 flex h-[1024px] flex-col items-center gap-10 text-center">
        <p className="title" id="DataList">
          Select the Drone
        </p>
        <p className="subtitle mt-2">
          Select a drone and view its data visualization.
        </p>
        <img src="/images/droneCardList.png" alt="" />

        <div className="absolute flex h-auto min-h-[37.5rem] w-full">
          <div
            id="modal"
            className="absolute left-1/2 top-1/2 flex h-[28.75rem] w-[40.625rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[10px] bg-[#F9F9F9]"
            role="dialog"
            aria-labelledby="login-modal-title"
            aria-hidden="false"
            tabIndex={-1}
          >
            {/* <button tabIndex={0} className="absolute right-10 top-10 h-6 w-6">
              <img
                className="cursor-pointer"
                src="/icons/close.svg"
                alt="Close"
              />
            </button> */}
            <p id="login-modal-title" className="mb-12 text-2xl font-bold">
              Login required to continue
            </p>
            <LoginForm onSuccess={() => {}} autoFocus={false} />
          </div>
        </div>
      </div>
    </>
  );
}