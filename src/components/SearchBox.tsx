"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Constituency } from "@/lib/types";

export function SearchBox({ constituencies }: { constituencies: Constituency[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return constituencies
      .filter(
        (constituency) =>
          constituency.name.toLowerCase().includes(term) ||
          constituency.onsCode?.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [constituencies, query]);

  function choose(id: string) {
    router.push(`/constituency/${id}`);
  }

  return (
    <div className="relative">
      <label htmlFor="constituency-search" className="mb-2 block text-sm font-semibold text-slate-700">
        Search for a parliamentary constituency
      </label>
      <input
        id="constituency-search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, results.length - 1));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
          }
          if (event.key === "Enter" && results[activeIndex]) {
            event.preventDefault();
            choose(results[activeIndex].id);
          }
        }}
        placeholder="Type a constituency, e.g. Cardiff West or Gravesham"
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        autoComplete="off"
      />
      {query.trim() ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {results.length ? (
            <ul role="listbox" aria-label="Constituency results">
              {results.map((result, index) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(result.id)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${
                      index === activeIndex ? "bg-slate-100 text-slate-950" : "text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{result.name}</span>
                    <span className="text-xs text-slate-500">{result.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-slate-600">
              No constituencies found. Try a different spelling or postcode-era constituency name.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
