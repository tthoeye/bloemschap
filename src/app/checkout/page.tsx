import Link from "next/link";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const raw = searchParams.message;
  const message = Array.isArray(raw) ? raw.join("\n") : raw ?? "";

  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-10 sm:pb-14">
      <main className="w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-start">
          <Link
            href="/"
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            ← Terug
          </Link>
        </div>
        <div className="rounded-3xl border border-border bg-card shadow-sm">
          <div className="p-7 sm:p-10">
            <h1 className="mt-6 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Afrekenen
            </h1>

            <div className="mt-7 rounded-2xl border border-border bg-background p-4">
              <div className="text-sm font-medium text-muted">Jouw boodschap</div>
              <div className="mt-2 whitespace-pre-wrap text-base leading-6">
                {message.trim() ? message : "—"}
              </div>
            </div>

            <CheckoutForm message={message} />
          </div>
        </div>
      </main>
    </div>
  );
}

