"use client";

import { useEffect, useId, useRef, useState } from "react";

const WELCOME_MESSAGE = `Love it or loathe it, devolution in the UK is a bit of a mess.

Some have combined authorities, some have county and district councils, some have one unitary council, and some have a mixture all of these. Scotland, Wales and Northern Ireland have their own devolved institutions. In many places, it is not obvious who is responsible for what.

This tool is a simple experiment. Search a parliamentary constituency to see which local authorities, combined authorities, mayoralties or devolved institutions sit behind it - and how "devolved" it appears to be from Westminster.

It will not settle the big questions, but it should make the system a little easier to understand.

Enjoy!`;

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
      className="welcome-dialog fixed inset-0 z-50 m-auto max-h-none max-w-none border-0 bg-transparent p-6 sm:p-8"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dismiss();
      }}
    >
      <div
        className="card flex max-h-[min(90vh,42rem)] w-full max-w-4xl flex-col overflow-hidden border-t-4 border-t-brand shadow-2xl sm:max-h-[min(90vh,48rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-brand-border bg-brand-tint px-8 py-6 text-center sm:px-10">
          <h2 id={titleId} className="text-2xl font-semibold text-brand-deep sm:text-3xl">
            What&apos;s it all about?
          </h2>
        </div>
        <div className="overflow-y-auto px-8 py-7 sm:px-10 sm:py-8">
          <p className="whitespace-pre-line text-lg leading-8 text-brand-deep/85">{WELCOME_MESSAGE}</p>
        </div>
        <div className="flex justify-end border-t border-brand-border bg-white px-8 py-5 sm:px-10">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md bg-brand px-5 py-2.5 text-base font-semibold text-white transition hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Continue exploring
          </button>
        </div>
      </div>
    </dialog>
  );
}
