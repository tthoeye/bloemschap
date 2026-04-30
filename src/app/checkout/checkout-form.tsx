"use client";

import type { HTMLAttributes } from "react";
import { useMemo, useState } from "react";

export default function CheckoutForm({ message }: { message: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const canSubmit = useMemo(() => {
    return (
      message.trim().length > 0 &&
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      address.trim().length > 0 &&
      postalCode.trim().length > 0 &&
      city.trim().length > 0
    );
  }, [address, city, email, fullName, message, postalCode]);

  return (
    <form
      className="mt-7 grid grid-cols-1 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        alert(
          "Demo checkout: hier kan je betaalprovider/checkout integreren (bv. Stripe).",
        );
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Naam"
          value={fullName}
          onChange={setFullName}
          placeholder="Voornaam + achternaam"
          autoComplete="name"
        />
        <Field
          label="E-mail"
          value={email}
          onChange={setEmail}
          placeholder="jij@voorbeeld.be"
          autoComplete="email"
          inputMode="email"
        />
      </div>

      <Field
        label="Adres"
        value={address}
        onChange={setAddress}
        placeholder="Straat + nummer"
        autoComplete="street-address"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field
          label="Postcode"
          value={postalCode}
          onChange={setPostalCode}
          placeholder="9000"
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <div className="sm:col-span-2">
          <Field
            label="Gemeente"
            value={city}
            onChange={setCity}
            placeholder="Gent"
            autoComplete="address-level2"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-55"
      >
        Betaal en bestel
      </button>

      <p className="text-center text-sm text-muted">
        Dit is een prototype: de knop toont enkel een demo-melding.
      </p>
    </form>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-muted">{props.label}</div>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

