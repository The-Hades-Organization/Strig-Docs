'use client';

import {
  useHighlightQuery,
  useStaticSearch,
  type SearchResultItem,
  type SearchResultRecord,
} from 'fumadocs-core/search/client';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { Icon } from './icons';
import { Kbd } from './Kbd';

const SHORTCUT_KEY = 'k';
const INDEX_URL = '/api/search';
const BROWSE_URL = '/docs';

const KIND_LABEL = { page: 'Page', heading: 'Heading', text: 'Text' } as const;

// The parsed content of a result, read only for its text and inline code.
type HastNode = {
  type: string;
  value?: unknown;
  tagName?: string;
  children?: readonly HastNode[];
};

const INLINE_TAGS = new Set(['a', 'b', 'code', 'del', 'em', 'i', 'kbd', 'mark', 'span', 'strong', 'sub', 'sup']);

function textOf(node: HastNode): string {
  if (node.type === 'text') return typeof node.value === 'string' ? node.value : '';
  return (node.children ?? []).map(textOf).join('');
}

function renderContent(node: HastNode, key: string): ReactNode {
  if (node.type === 'text') return typeof node.value === 'string' ? node.value : null;
  if (node.type === 'element' && node.tagName === 'code') return <code key={key}>{textOf(node)}</code>;
  return (node.children ?? []).map((child, index) => {
    const rendered = renderContent(child, `${key}.${index}`);
    // Block elements (paragraphs, cells) are joined with a space, not run together.
    const isBlock = child.type === 'element' && !INLINE_TAGS.has(child.tagName ?? '');
    return isBlock ? [rendered, ' '] : rendered;
  });
}

type Row = {
  id: string;
  url: string;
  kind: SearchResultRecord['type'];
  content: HastNode;
  where: string;
};

// Flattens table results into their rows and gives every row the page it sits on.
// Results arrive grouped: a page, then the headings and text that matched in it.
function toRows(items: readonly SearchResultItem[]): Row[] {
  const rows: Row[] = [];
  let page = '';
  const push = (record: SearchResultRecord) => {
    if (record.type === 'page') page = textOf(record.hastContent);
    rows.push({
      id: record.id,
      url: record.url,
      kind: record.type,
      content: record.hastContent,
      where: record.type === 'page' ? (record.breadcrumbs ?? []).join(' › ') : page,
    });
  };
  for (const item of items) {
    if (item.type === 'table') item.rows.forEach(push);
    else push(item);
  }
  return rows;
}

export function Search() {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  // A failed index download is cached by its URL; a new attempt asks under a fresh one.
  const [attempt, setAttempt] = useState(0);
  const from = attempt === 0 ? INDEX_URL : `${INDEX_URL}?attempt=${attempt}`;
  const { search, onSearchChange, isLoading, data, error } = useStaticSearch({ from });
  const highlight = useHighlightQuery(data?.query ?? '');
  const listId = useId();
  const hintId = useId();

  const openDialog = () => {
    if (!dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    setOpen(true);
  };

  // The shortcut listener has an owner: it is removed on unmount.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === SHORTCUT_KEY) {
        event.preventDefault();
        if (!dialog.current || dialog.current.open) return;
        dialog.current.showModal();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const rows = data ? toRows(data.items) : [];
  const hasQuery = search.trim().length > 0;
  const current = rows.length === 0 ? -1 : Math.min(active, rows.length - 1);
  const optionId = (index: number) => `${listId}-${index}`;

  const showError = hasQuery && error !== undefined && !isLoading;
  const showLoading = hasQuery && !showError && rows.length === 0 && isLoading;
  const showEmpty = hasQuery && !showError && !isLoading && data !== undefined && rows.length === 0;
  const showRows = hasQuery && !showError && rows.length > 0;

  let status = '';
  if (showError) status = 'Search couldn’t load.';
  else if (showLoading) status = 'Loading the search index.';
  else if (showEmpty && data) status = `No page matches “${data.query}”.`;
  else if (showRows && !isLoading) status = rows.length === 1 ? '1 result.' : `${rows.length} results.`;

  const moveTo = (index: number) => {
    setActive(index);
    document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' });
  };

  const onFieldKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!showRows) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveTo((current + 1) % rows.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveTo((current - 1 + rows.length) % rows.length);
    } else if (event.key === 'Enter' && current >= 0) {
      event.preventDefault();
      document.getElementById(optionId(current))?.querySelector('a')?.click();
    }
  };

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
        className="search-modal"
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
          <div className="search-box">
            <label className="search-box-field">
              <Icon name="search" size={18} />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setActive(0);
                  onSearchChange(event.target.value);
                }}
                onKeyDown={onFieldKey}
                placeholder="Search by word or permission"
                aria-label="Search the docs"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showRows}
                aria-controls={listId}
                aria-activedescendant={showRows && current >= 0 ? optionId(current) : undefined}
                aria-describedby={hintId}
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
            </label>
            <span id={hintId} className="sr-only">
              Arrow keys move through the results; Enter opens the selected one.
            </span>
            <div className="search-box-results" aria-busy={showLoading}>
              {!hasQuery ? (
                <div className="search-box-note">
                  <p>Type to search pages, headings and text.</p>
                </div>
              ) : null}
              {showLoading ? (
                <div className="search-box-note">
                  <p>Loading the search index.</p>
                </div>
              ) : null}
              {showError ? (
                <div className="search-box-note">
                  <p>Search couldn’t load. Browse the pages from the menu.</p>
                  <button type="button" className="button" onClick={() => setAttempt((n) => n + 1)}>
                    Try again
                  </button>
                </div>
              ) : null}
              {showEmpty && data ? (
                <div className="search-box-note">
                  <p>No page matches “{data.query}”.</p>
                  <a href={BROWSE_URL} onClick={() => dialog.current?.close()}>
                    Browse the pages
                  </a>
                </div>
              ) : null}
              <ul
                id={listId}
                role="listbox"
                aria-label="Results"
                hidden={!showRows}
                key={data?.query ?? ''}
                ref={highlight}
              >
                {showRows
                  ? rows.map((row, index) => (
                      <li
                        key={row.id}
                        id={optionId(index)}
                        role="option"
                        aria-selected={index === current}
                        onMouseMove={() => {
                          if (index !== current) setActive(index);
                        }}
                      >
                        <a href={row.url} tabIndex={-1} onClick={() => dialog.current?.close()}>
                          <span className="search-box-kind" data-highlight-ignore="">
                            {KIND_LABEL[row.kind]}
                          </span>
                          <span>
                            <span className="search-box-text">{renderContent(row.content, row.id)}</span>
                            {row.where ? (
                              <span className="search-box-where" data-highlight-ignore="">
                                {row.where}
                              </span>
                            ) : null}
                          </span>
                        </a>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
            <p className="sr-only" role="status">
              {status}
            </p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
