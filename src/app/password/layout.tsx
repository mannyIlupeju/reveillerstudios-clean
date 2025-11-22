import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password",
  description:
    "This isn’t just fashion — it’s a manifesto. Access page for Reveillerstudios.",
};

// 👇 No Nav, no Header, no Footer — just children.
export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main className="flex flex-col">
        {children}
      </main>
   
  );
}