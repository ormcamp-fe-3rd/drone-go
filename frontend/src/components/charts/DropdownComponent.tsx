import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaCaretDown } from "react-icons/fa";

interface DropdownDroneTypeProps<T> {
  label: string;
  onSelect: (item: T) => void;
  data?: T[];
}

const DropdownComponent = <T extends { _id: string; name?: string }>({
  label,
  onSelect,
  data = [],
}: DropdownDroneTypeProps<T>) => {
  // data가 배열이 아닌 경우를 처리
  const sortedData = Array.isArray(data) ? [...data] : [];

  sortedData.sort((a, b) => {
    if (typeof a._id === "string" && typeof b._id === "string") {
      return a._id.localeCompare(b._id);
    }
    return 0;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-[#BBBBBB] flex w-44 justify-around rounded-[8px] bg-white"
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
              {item.name || `Operation ${index + 1}`}
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

