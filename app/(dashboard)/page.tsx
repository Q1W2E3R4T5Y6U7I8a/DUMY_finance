"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function Home() {
  //Hook for whether open new acc
  const { onOpen } = useNewAccount();

  return (
    <div>
      <Button onClick={onOpen}>
        Add an account
      </Button>
    </div>
  );
};
