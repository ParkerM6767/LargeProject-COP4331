import { useContext } from "react";
import { PostContext } from "../lib/postContext";
import { cn } from "../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";

export function SidebarPagination() {
  const { page, pageMax = 10, setPage } = useContext(PostContext);
  // TODO: once the number of posts can be gotten, use it here to jump to end

  return (
    <Pagination>
      <PaginationContent className="py-3 grid grid-cols-7 place-items-center">
        {/* First page */}
        <PaginationItem
          className={cn(page > 2 || "invisible *:transition-none")}
        >
          <PaginationLink
            className="border rounded-md border-primary-foreground"
            size={"sm"}
            onClick={() => setPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {/* Some amount of pages between the first and current-1, 
            shows when X > 2 for 1/.../X-1/X/X+1/.../N  */}
        {
          <PaginationEllipsis
            className={cn(page > 2 || "invisible *:transition-none")}
          />
        }

        {/* Current-1, show if not on first page */}
        <PaginationItem
          className={cn(page !== 1 || "invisible *:transition-none")}
        >
          <PaginationLink
            className="border rounded-md border-primary-foreground"
            size={"sm"}
            onClick={() => setPage(page - 1)}
          >
            {page - 1}
          </PaginationLink>
        </PaginationItem>

        {/* Current page */}
        <PaginationItem>
          <PaginationLink
            className="border rounded-md border-primary-foreground"
            size={"sm"}
            isActive
          >
            {page}
          </PaginationLink>
        </PaginationItem>

        {/* Current+1, show if not on last page */}
        <PaginationItem
          className={cn(page !== pageMax || "invisible *:transition-none")}
        >
          <PaginationLink
            className="border rounded-md border-primary-foreground"
            size={"sm"}
            onClick={() => setPage(page + 1)}
          >
            {page + 1}
          </PaginationLink>
        </PaginationItem>

        {/* Some amount of pages between the current+1 and last, 
            shows when X < N-1 for 1/.../X-1/X/X+1/.../N  */}
        <PaginationEllipsis
          className={cn(page < pageMax - 1 || "invisible *:transition-none")}
        />

        {/* Last page */}
        <PaginationItem
          className={cn(page < pageMax - 1 || "invisible *:transition-none")}
        >
          <PaginationLink
            className="border rounded-md border-primary-foreground"
            size={"sm"}
            onClick={() => setPage(pageMax)}
          >
            {pageMax}
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
