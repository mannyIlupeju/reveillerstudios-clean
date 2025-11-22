"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Newsletter from "@/components/Newsletter/Newsletter";
import BackgroundVisual from "./backgroundVisual";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "newsletter">("password");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Wrong password. Try again.");
    }
  }

  // 🔄 Component Renderer via Switch Statement
  function renderContent() {
    switch (mode) {
      case "newsletter":
        return <Newsletter forceShowOnMount/>;

      case "password":
      default:
        return (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm border border-zinc-700 bg-white rounded-2xl px-6 py-8 flex flex-col gap-4 font-satoshi"
          >
            <h1 className="text-xl font-semibold text-center tracking-wide">
             Already Subscribed?
            </h1>
            <p className="text-xs text-zinc-400 text-center">
              Enter the access code to view the site.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-zinc-700 bg-transparent px-3 py-2 rounded-lg outline-none text-sm"
              placeholder="Access code"
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              className="mt-2 border border-white signUp-button rounded-lg px-3 py-2 text-xs tracking-[0.2em] uppercase"
            >
              Enter
            </button>
          </form>
        );
    }
  }

return (
  <main className="relative min-h-screen flex items-center justify-center text-black">
    {/* Background */}
    <BackgroundVisual />

    {/* Toggle buttons */}
    <div className="absolute top-10 right-2 z-20">
      <div className="flex gap-4">
        <button
          className="bg-black text-white p-2"
          onClick={() => setMode("newsletter")}
        >
          Subscribe
        </button>

        <button
          className="bg-black text-white p-2"
          onClick={() => setMode("password")}
        >
          Password
        </button>
      </div>
    </div>

    {/* Foreground content */}
    <section className="relative z-10">
      {renderContent()}
    </section>
  </main>
);
}