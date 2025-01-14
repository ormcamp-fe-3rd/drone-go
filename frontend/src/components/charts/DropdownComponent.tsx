import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaCaretDown } from "react-icons/fa";

// 제네릭 타입을 사용하여 타입을 동적으로 처리합니다.
interface DropdownDroneTypeProps<T> {
  label: string;
  onSelect: (item: T) => void;
  data?: T[]; // data는 제네릭 타입으로 처리됩니다.
}

const DropdownComponent = <T extends { _id: string; name: string }>({
  label,
  onSelect,
  data = [],
}: DropdownDroneTypeProps<T>) => {
  const sortedData = [...data].sort((a, b) => a._id.localeCompare(b._id));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-#BBBBBF flex w-44 justify-around rounded-[8px] border"
        >
          {label}
          <FaCaretDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 rounded-[8px] bg-white">
        {sortedData.length ? (
          sortedData.map((item, index) => (
            <DropdownMenuItem
              key={item._id}
              onClick={() => onSelect(item)}
              className="flex flex-col items-center justify-center w-full border-b border-neutral-40"
            >
              {"name" in item ? item.name : `Operation ${index + 1}`}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No data available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownComponent;
