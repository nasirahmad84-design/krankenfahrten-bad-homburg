'use client';

import {useEffect, useRef, useState} from 'react';
import {RideRequestForm} from './ride-request-form';

export function RideRequestDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef('');
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    function open(event: MouseEvent) {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-ride-request]') : null;
      if (!anchor || !dialog.current?.showModal) return;
      event.preventDefault();
      trigger.current = anchor;
      setMounted(true);
      // Let the mobile navigation finish closing and restoring its scroll state.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!dialog.current || dialog.current.open) return;
        previousOverflow.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.current.showModal();
        dialog.current.querySelector<HTMLElement>('form h3')?.focus({preventScroll: true});
      }));
    }
    document.addEventListener('click', open, true);
    return () => document.removeEventListener('click', open, true);
  }, []);
  return <dialog ref={dialog} aria-labelledby="ride-dialog-title" aria-describedby="ride-dialog-description" onCancel={event => {if (busy) event.preventDefault();}} onClose={() => {
    document.body.style.overflow = previousOverflow.current;
    if (trigger.current?.isConnected) trigger.current.focus({preventScroll: true});
  }} className="ride-request-dialog fixed m-auto w-[calc(100%-1.5rem)] max-w-xl overflow-hidden rounded-2xl border-0 bg-white p-0 text-navy shadow-2xl backdrop:bg-navy/60">
    <header className="flex items-start justify-between gap-3 border-b border-navy/10 px-5 py-3">
      <div><h2 id="ride-dialog-title" className="text-lg font-bold">Ihre Fahrt anfragen</h2><p id="ride-dialog-description" className="mt-1 text-xs text-navy/70">Vier Schritte · unverbindlich</p></div>
      <button type="button" disabled={busy} aria-label="Anfrage schließen" onClick={() => dialog.current?.close()} className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f6f9fc] text-2xl disabled:opacity-40">×</button>
    </header>
    <div className="max-h-[calc(90dvh-5rem)] overflow-y-auto overscroll-contain p-2 sm:p-3">{mounted && <RideRequestForm onBusyChange={setBusy} />}</div>
  </dialog>;
}
