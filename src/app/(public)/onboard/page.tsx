"use client";

import PasswordForm from "@/components/password-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardContent() {
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

function Onboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardContent />
    </Suspense>
  );
}

export default Onboard;
