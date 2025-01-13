import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Robot {
  _id: string;
  name: string;
  robot_id: string;
}

const DropdownDroneType = ({
  label,
  onSelect,
}: {
  label: string;
  onSelect: (item: Robot) => void;
}) => {
  const [data, setData] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/robots");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-#BBBBBF rounded-[8px] border"
        >
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-[8px] bg-white">
        {loading ? (
          <DropdownMenuItem>Loading...</DropdownMenuItem>
        ) : data.length > 0 ? (
          data.map((item) => (
            <DropdownMenuItem key={item._id} onClick={() => onSelect(item)}>
              {item.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No data found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownDroneType;
