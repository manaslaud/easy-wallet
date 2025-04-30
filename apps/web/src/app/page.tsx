"use client";
import { createBaseAccount } from "@/helpers/createAccount";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    const f = async () => {
      const password = "12345678";
      const label = "manas account";
      console.log(await createBaseAccount(password, label));
    };
    f();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the web app!</h1>
      <p className="mt-4 text-lg">This is a simple web application.</p>
    </main>
  );
}
