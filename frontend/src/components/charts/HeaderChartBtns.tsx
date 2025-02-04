import { useContext } from "react";
import { Link } from "react-router-dom";

import SelectedDataContext from "@/contexts/SelectedDataContext";

import { Button } from "../ui/button";

interface Props {
  exportToExcel: () => void;
}

export default function HeaderChartBtns({ exportToExcel }: Props) {
  const { selectedDrone, selectedOperationAndDate } = useContext(SelectedDataContext);

  const handleExportClick = () => {
    if (!selectedDrone || !selectedOperationAndDate) {
      alert("드론과 오퍼레이션 날짜를 선택해야 합니다.");
      return;
    }
    exportToExcel();
  };

  return (
    <>
      <Button
        className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white"
        onClick={handleExportClick}
      >
        <img
          src="/icons/download.svg"
          alt="Button Icon"
          className="h-16 w-16 object-contain"
        />
      </Button>
      <Link to="/map">
        <Button className="h-16 w-16 min-w-[64px] rounded-[10px] bg-white">
          <img
            src="/icons/maps.svg"
            alt="Maps Icon"
            className="h-16 w-16 object-contain"
          />
        </Button>
      </Link>
    </>
  );
}