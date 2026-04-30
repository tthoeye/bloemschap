"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const BIKE_IMAGE_URL =
  "https://44a6c80ff9.clvaw-cdnwnd.com/b94f3baaaf906e4f53c019b6c29a664c/200000120-e0124e0125/romanticsonly.webp?ph=44a6c80ff9";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const canContinue = useMemo(() => message.trim().length > 0, [message]);

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-10 sm:pb-14">
      <main className="w-full max-w-2xl">
        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="p-7 sm:p-10">
            <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Stuur een Bloemschap!
            </h1>

            <div className="mt-7 overflow-hidden rounded-2xl border border-border bg-background">
              <Image
                src={BIKE_IMAGE_URL}
                alt="Bloemenbezorging met fiets"
                width={1350}
                height={900}
                className="h-auto w-full"
                priority
              />
            </div>

            <label className="mt-7 block text-sm font-medium text-muted">
              Jouw boodschap
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Schrijf hier je kaartje…"
              rows={6}
              className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-base leading-6 outline-none ring-0 transition focus:border-transparent focus:ring-2 focus:ring-primary"
            />

            <button
              type="button"
              disabled={!canContinue}
              onClick={() =>
                router.push(`/checkout?message=${encodeURIComponent(message)}`)
              }
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-55"
            >
              Naar afrekenen
            </button>

            <p className="mt-3 text-center text-sm text-muted">
              Je boodschap nemen we mee op het kaartje bij het boeket.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
