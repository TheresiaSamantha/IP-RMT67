# Frontend specification - Book Recommender (client)

This file describes the frontend structure, components, pages and hooks for the Book Recommender app (client folder).

Pages

- `Home.jsx` — Infinite scroll of recommended books. Uses `useFetchBooks` to fetch pages and `useInfiniteScroll` to trigger loading more. Displays `BookCard` components.
- `MyList.jsx` — Shows current user's saved books (CRUD). Calls `/mylist` endpoints. Uses `BookCard` and `BookDetailModal` for editing/notes.
- `Detail.jsx` — Book detail view. Shows cover, metadata and an AI-generated summary (calls POST `/books/summarize`).

Components

- `BookCard` — small card with cover, title, author, and a button to open details or add to MyList.
- `BookDetailModal` — modal showing full details and a button to request AI summary.
- `Navbar` — top navigation with links to Home and MyList and optional search box.
- `Footer` — site footer.

Hooks

- `useInfiniteScroll` — simple hook that fires a callback when a sentinel element becomes visible (IntersectionObserver).
- `useFetchBooks` — hook to fetch paginated books from backend `/books/search` endpoint using `axios`.

Where to place

- `client/src/pages/` for page components
- `client/src/components/` for reusable components
- `client/src/hooks/` for hooks

Minimal runtime assumptions

- Backend base URL: use `import.meta.env.VITE_API_BASE_URL` (default to `http://localhost:5000`).
- All API calls use `axios`.

Packages to install (client)

- axios — HTTP client
- react-router-dom — routing (v6)
- tailwindcss (or your choice of CSS framework) — styling; you can swap for Bootstrap
- react-icons (optional) — icons

Install commands (from `client/`):

```bash
npm install axios react-router-dom
# for Tailwind (optional):
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Dev tools / linters (recommended)

- eslint, prettier

How files work together (quick flow)

- `Home.jsx` uses `useFetchBooks(query)` to get pages. `useInfiniteScroll` appends more pages when the sentinel appears. Each `BookCard` links to `Detail.jsx`.
- `Detail.jsx` fetches book metadata (from DB via `/books/search?q=title` or via a dedicated book endpoint if added), and can call `/books/summarize` to request AI summary.
- `MyList.jsx` uses `/mylist` endpoints to list, create, update and delete MyList items.

Notes

- These files are skeletons / stubs. Integrate with your auth flow if you have user identity, and adapt CSS to Tailwind classes.
