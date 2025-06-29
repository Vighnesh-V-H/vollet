"use client";

import PasswordForm from "@/components/password-form";
import { useSearchParams } from "next/navigation";

function Onboard() {
  const searchParmas = useSearchParams();
  const id = searchParmas.get("id");

  if (!id) {
    return <div>id not found select a blockchain</div>;
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <PasswordForm id={id} />
    </div>
  );
}

export default Onboard;
