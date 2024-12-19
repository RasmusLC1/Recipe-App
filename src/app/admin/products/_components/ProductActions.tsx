"use client";

import { useTransition } from "react";
import {
  deleteProduct,
  toggleProductAvailability,
} from "../../_actions/products";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
export function ActiveToggleDropdownItem({
  id,
  isAvailabelForPurchase,
}: {
  id: string;
  isAvailabelForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();

    const router = useRouter() 

  return (
    <DropdownMenuItem
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailabelForPurchase);
          router.refresh() // Refreshes the page when triggered

        });
      }}
    >
      {isAvailabelForPurchase ? "Deactive" : "Activate"}
    </DropdownMenuItem>
  );
}

// Checks to see if the product has orders, if yes disables the product
export function DeleteDropdownItem({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh()
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
