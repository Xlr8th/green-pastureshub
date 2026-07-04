# Bug Report: Pagination & Sort/Category Reset Issue

**Project:** Green Pastures (Next.js 15, React 19)
**Component(s):** `HomeClient.jsx`, `Hero.jsx`
**Status:** ✅ Resolved

---

## 1. Symptoms

Two related bugs surfaced after adding pagination to the blog's home page:

1. **Pagination skipped pages.** Clicking "Next" took the URL from `/?page=2` back to `/` (page 1) instead of `/?page=3`. Manually typing `?page=3` into the address bar worked fine.
2. **Sort/category selections were silently discarded.** Clicking a subcategory filter and then opening the sort dropdown reset the view back to "all articles" before any sort option was even chosen — unless sort was clicked *first*.

---

## 2. Investigation

### Step 1 — Duplicated state (initial suspect)

The original code kept `currentPage`, `currentSort`, and `currentSubCategory` in **both** `useState` *and* the URL (via `useSearchParams`), synced by a `useEffect`. This created two sources of truth that could drift apart on every navigation.

**Fix attempted:** Removed the duplicate `useState`/`useEffect` pair and derived `currentPage`, `currentSort`, `currentSubCategory` directly from `searchParams` on every render, making the URL the single source of truth.

This didn't fully fix it — console logging `buildUrl` revealed two remaining problems.

### Step 2 — Console log revealed the real culprits

```
buildUrl [?] → {category: 'all', search: '', sort: 'newest', page: 1, overrides: {…}}
buildUrl [handlePageChange] → {category: 'all', search: '', sort: 'newest', page: 2, overrides: {…}}
buildUrl [?] → {category: 'all', search: '', sort: 'newest', page: 1, overrides: {…}}
buildUrl [handlePageChange] → {category: 'all', search: '', sort: 'newest', page: '21', overrides: {…}}
```

Two distinct bugs were hiding in this log:

**Bug A — String concatenation instead of addition**

```js
const currentPage = searchParams.get('page') || 1;
```

`URLSearchParams.get()` always returns a **string**. So `currentPage` was `"2"`, not `2`. The Next button did:

```js
onClick={() => handlePageChange(currentPage + 1)}
```

`"2" + 1` in JavaScript concatenates to `"21"` instead of adding to `3` — exactly the `page: '21'` seen in the log. (The Previous button's `currentPage - 1` happened to work, because `-` always forces numeric coercion, unlike `+`.)

**Bug B — A rogue `buildUrl [?]` call before every real navigation**

The `'?'` tag is `buildUrl`'s default `caller` name, used only by `handleSearch`. That meant something was calling `onSearch('')` on its own, without the user touching the search box.

Tracing it back to `Hero.jsx` found the source: a "click outside to close search" handler.

```js
const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
        onSearch('')
    }
}
document.addEventListener('mousedown', handleClickOutside)
```

This fires on **every mousedown anywhere on the page** outside the search box — including clicks on Next, Sort, and Category. It unconditionally called `onSearch('')`, which triggered `handleSearch('')` in `HomeClient.jsx`:

```js
const handleSearch = (value) => {
    setSearchTerm(value);
    router.replace(buildUrl({search: value}), { scroll: false }); // page defaults back to 1
};
```

Since `buildUrl` defaults `page` to `1` when no override is passed, this phantom call reset the URL right before (or in place of) the user's actual intended navigation — explaining both the pagination skip and the sort/category resets.

---

## 3. Root Causes (Summary)

| # | Root Cause | Effect |
|---|---|---|
| 1 | `currentPage` read from `searchParams.get()` as a string, then used with `+` | `"2" + 1` → `"21"` instead of `3`; Next button broke after the first click |
| 2 | Duplicate state (`useState`) synced with URL via `useEffect` | Race conditions between state updates and URL changes |
| 3 | `Hero.jsx`'s outside-click handler called `onSearch('')` unconditionally | Every click anywhere on the page (Next, Sort, Category) triggered an unwanted search-clear navigation that reset page/sort/category to defaults |

---

## 4. Fixes Applied

**`HomeClient.jsx`** — derive page as a number, not a string:

```js
const currentPage = Number(searchParams.get('page')) || 1;
```

**`HomeClient.jsx`** — removed duplicate `useState`/`useEffect` for `currentPage`, `currentSort`, `currentSubCategory`; these are now derived fresh from `searchParams` every render, making the URL the single source of truth. Only `searchTerm` keeps local state (for responsive typing), synced from the URL via a small `useEffect`.

**`Hero.jsx`** — only clear the search when there's actually a search term active, and added `searchTerm` to the effect's dependency array to avoid a stale closure:

```js
const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target) && searchTerm) {
        onSearch('')
    }
}
document.addEventListener('mousedown', handleClickOutside)
...
}, [searchTerm]);
```

---

## 5. Result

- Pagination now advances correctly: `1 → 2 → 3 → …`
- Selecting a subcategory or sort option no longer gets silently overwritten by a phantom "clear search" navigation.
- URL is now the single source of truth for `page`, `sort`, and `category` — eliminating an entire class of state/URL desync bugs going forward.

---

## 6. Open Follow-up (Not a Bug, a UX Decision)

The "click outside to close search" behavior currently **also clears the typed search term**, not just the dropdown visibility. If the desired UX is "close the dropdown but keep what I typed if I refocus the input," that would need a separate `isDropdownOpen` state rather than tying visibility to `searchTerm` itself. Flagged for a future decision, not fixed as part of this bug report.
