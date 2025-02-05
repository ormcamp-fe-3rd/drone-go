import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaCaretDown } from "react-icons/fa";

interface DropdownDroneTypeProps<T> {
  value: string;
  onSelect: (item: T) => void;
  data?: T[];
}

const DropdownComponent = <
  T extends {
    _id: string;
    name: string;
    operationId: string;
    timestamp: string;
  },
>({
  value,
  onSelect,
  data = [],
}: DropdownDroneTypeProps<T>) => {
  // data가 배열이 아닌 경우를 처리
  const sortedData = Array.isArray(data) ? [...data] : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-52 justify-around rounded-[8px] border border-[#BBBBBF] bg-white"
        >
          {value}
          <FaCaretDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 rounded-[8px] bg-white">
        {sortedData.length ? (
          sortedData.map((item) => {
            return (
              <DropdownMenuItem
                key={item._id}
                onClick={() => onSelect(item)}
                className="border-neutral-40 flex w-full flex-col items-center justify-center border-b"
              >
                {item.name}
              </DropdownMenuItem>
            );
          })
        ) : (
          <DropdownMenuItem>No data available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownComponent;
