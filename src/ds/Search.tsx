'use client';

import { useStaticSearch } from 'fumadocs-core/search/client';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';
import { Kbd } from './Kbd';

const SHORTCUT_KEY = 'k';

export function Search() {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const { search, onSearchChange, isLoading, data, error } = useStaticSearch({ from: '/api/search' });

  const openDialog = () => {
    dialog.current?.showModal();
    setOpen(true);
  };

  // The shortcut listener has an owner: it is removed on unmount.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === SHORTCUT_KEY) {
        event.preventDefault();
        dialog.current?.showModal();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = Array.isArray(data) ? data : [];
  const hasQuery = search.trim().length > 0;

  return (
    <>
      <button ref={opener} type="button" className="search-trigger" onClick={openDialog}>
        <Icon name="search" size={16} />
        <span className="search-trigger-text">Search the docs</span>
        <span className="search-trigger-keys" aria-hidden="true">
          <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-label="Search the docs"
        onClose={() => {
          setOpen(false);
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
      >
        {open ? (
          <div className="search-panel">
            <label className="search-field">
              <Icon name="search" size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by word or permission"
                aria-label="Search the docs"
                autoFocus
              />
            </label>
            <div className="search-results" aria-live="polite">
              {error ? <p className="search-note">The search index could not be loaded.</p> : null}
              {!error && hasQuery && !isLoading && results.length === 0 ? (
                <p className="search-note">Nothing matches that. Try a shorter word.</p>
              ) : null}
              {!error && !hasQuery ? <p className="search-note">Type to search pages and headings.</p> : null}
              <ul>
                {results.map((result) => (
                  <li key={result.id}>
                    <a href={result.url} onClick={() => dialog.current?.close()}>
                      <span className="search-kind">{result.type}</span>
                      <span className="search-content">{result.content}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
