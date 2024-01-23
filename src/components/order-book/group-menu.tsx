import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrderBook } from "@/hooks/use-order-book";

export function GroupMenu() {
  const { group } = useOrderBook();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Group {group.value.toFixed(2)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Group</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={group.value.toFixed(2)}
          onValueChange={(value) => (group.value = Number(value))}
        >
          {[0.1, 0.5, 1, 2, 5, 10].map((value) => (
            <DropdownMenuRadioItem key={value} value={value.toFixed(2)}>
              {value.toFixed(2)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
