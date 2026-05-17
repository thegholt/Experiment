"use client";

import { useEffect, useId, useRef, useState } from "react";

const WELCOME_MESSAGE = `Love or loathe it; one thing we all agree is that devolution is a mess, different areas get settlements, some have multiple authorities where some have one, who's accountable for anything? Does more politicans equal better services? These a very important questions - we won't answer them here!

The purpose of this expirement is to demonstrate how each parliamentary constituency has running it's locally services, how "devolved" it is from Westminster, enjoy!`;

export function WelcomeModal() {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dismissed) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [dismissed]);

  function dismiss() {
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="welcome-dialog fixed inset-0 z-50 m-0 flex max-h-none max-w-none items-center justify-center border-0 bg-transparent p-4 backdrop:bg-brand-deep/60"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dismiss();
      }}
    >
      <div
        className="card flex max-h-[min(85vh,40rem)] w-full max-w-xl flex-col overflow-hidden border-t-4 border-t-brand shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-brand-border bg-brand-tint px-6 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-brand-deep">
            Welcome to DevoCompare
          </h2>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <p className="whitespace-pre-line text-base leading-7 text-brand-deep/85">{WELCOME_MESSAGE}</p>
        </div>
        <div className="flex justify-end border-t border-brand-border bg-white px-6 py-4">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Continue exploring
          </button>
        </div>
      </div>
    </dialog>
  );
}
