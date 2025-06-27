"use client";

export const isNewUser = () => {
  const walletMeta = localStorage.getItem("walletMeta");
  return !walletMeta;
};
