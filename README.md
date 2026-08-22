# Neno X

Neno X is a React-based social platform connected to the Route Posts REST API. Authenticated users can publish and share posts, interact through likes, comments, replies, follow people, discover suggestions, manage their profile, and receive notification updates.

# Project Overview

Neno X is a single-page social application for sharing content and following community activity. The frontend communicates directly with a REST backend through Axios and uses TanStack Query to fetch, cache, refresh, and invalidate server data.

The main user journey is:

```text
Create account or log in
        |
        v
Home feed or following-only feed
        |
        v
Create posts, like, bookmark, comment, reply, or share
        |
        v
Follow users and open profiles
        |
        v
Read and manage notifications
```

The application is intended for authenticated social-platform users. Unauthenticated visitors can access registration and login, while social features are protected by route guards.

# Features

- **Authentication:** Registration and login backed by REST endpoints, with client-side validation using React Hook Form and Zod.
- **Protected navigation:** Authenticated pages are wrapped by `ProtectRoute`; login and registration are wrapped by `ProtectAuth`.
- **Home and following feeds:** Recent posts and followed-user posts are loaded through TanStack Query.
- **Posts:** Create text/image posts, edit or delete owned posts, open details, like, bookmark, comment, reply, and share.
- **Comments and replies:** Create comments with optional images, edit/delete owned comments, load replies, and create replies.
- **Likes modal:** View a paginated list of users who liked a post.
- **Profiles:** View the current profile and other users' profiles, posts, follower counts, following counts, and bookmarks.
- **Follow system:** Follow/unfollow users and refresh related cached views.
- **Follow suggestions:** Suggestions appear in the home sidebar and on `/follow-suggestions`.
- **Notifications:** Paginated notifications, unread badges, mark-one-as-read, mark-all-as-read, and 30-second REST polling.
- **Account settings:** Profile-photo upload, local cover-photo preview, password change, and logout.
- **Responsive UI:** Desktop sidebar, mobile navbar menu, responsive feed grids, cards, forms, and modals.
- **Offline and feature states:** Offline detection plus loading, error, retry, and empty states where implemented.

# User Experience

1. A visitor creates an account at `/` or signs in at `/login`.
2. After authentication, the app loads the current user profile and redirects to `/home`.
3. The user browses the general feed, following-only feed, or discover page.
4. Posts support author navigation, follow/unfollow, like, bookmark, comment, share, and details. Owners also see edit/delete actions.
5. The profile page shows user details, posts, followers, following, and bookmarks.
6. Notifications appear in the navbar/sidebar badge and notification center.
7. Settings provides profile-photo upload, cover preview, password change, and logout.

# Tech Stack

| Technology | Purpose |
| --- | --- |
| React 19 | Component-based UI and local state |
| Vite | Development server and production build |
| React Router DOM | Browser routing, nested layout, guards, dynamic routes, and route errors |
| Axios | HTTP requests to the REST API |
| REST API | Backend data source at `https://route-posts.routemisr.com` |
| TanStack Query | Server-state fetching, caching, mutations, polling, and invalidation |
| Tailwind CSS 4 | Utility-first styling and responsive layouts |
| ESLint | JavaScript/JSX linting |

# Libraries & Dependencies

| Library | Purpose | Usage in the project |
| --- | --- | --- |
| `@tanstack/react-query` | Server-state management | Feeds, posts, profiles, comments, suggestions, bookmarks, likes, notifications |
| `@tanstack/react-query-devtools` | Query inspection | `App.jsx` |
| `axios` | REST requests | Auth, posts, users, comments, likes, follows, notifications |
| `react-router-dom` | Routing | `App.jsx` and navigation components |
| `react-hook-form` | Form state and submission | Login, registration, create-comment forms |
| `@hookform/resolvers` | Form-schema adapter | Auth form validation |
| `zod` | Client-side validation | Login and registration schemas |
| `react-helmet-async` | Document titles | `Layout.jsx` |
| `react-toastify` | Success, error, notification toasts | Mutations and polling |
| `react-icons` | UI icons | Navbar, sidebar, cards, forms, modals, settings |
| `react-use` | Browser network state | `useNetworkState` in `App.jsx` |
| `@heroui/react` | UI component dependency | `Button` import in `Register.jsx` |
| `@heroui/styles` | HeroUI styles package | Installed; no direct `src` import found |
| `@gravity-ui/icons` | Icon package | Installed; no direct `src` import found |
| `react-spinners` | Spinner package | Installed; app uses local `Spinner` component |
| `tailwindcss` | CSS utility framework | `src/index.css` and JSX classes |
| `@tailwindcss/vite` | Tailwind Vite integration | `vite.config.js` |
| `react-dom` | React rendering and portals | `main.jsx`, `LikesModal.jsx` |

Development tooling also includes `@vitejs/plugin-react`, ESLint, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@eslint/js`, `globals`, `@tanstack/react-devtools`, and React type packages. No direct import of `@tanstack/react-devtools` was found in application source.

# React Hooks

| Hook | Purpose | Main locations |
| --- | --- | --- |
| `useState` | Local UI, modal, preview, pagination, and form state | Auth, posts, comments, navbar, settings, notifications, contexts |
| `useEffect` | Loading effects, listeners, polling, and preview cleanup | AuthContext, Layout, comments, image components, ScrollToTop |
| `useContext` | Reads authentication and counter context | Authenticated components and navigation |
| `useCallback` | Stabilizes the user-data loader | AuthContext |
| `useRef` | File inputs, previews, DOM values, known notification IDs | Post/comment/image components and polling |
| `useNavigate` | Programmatic navigation | Login, registration, logout, notifications |
| `useParams` | Reads dynamic route IDs | UserProfile, PostDetails |
| `useLocation` | Reads the current route | Layout, DropdownButton |
| `useRouteError` | Reads router errors | RouteError |
| `useForm` | Form registration and validation errors | Login, Register, CreateComment |
| `useQuery` | Fetches and caches server data | Feed, profile, comment, like, suggestion, bookmark, notification components |
| `useMutation` | Executes write operations | Posts, comments, likes, follows, settings, notifications |
| `useQueryClient` | Invalidates or updates cached queries | Post, comment, follow, profile, notification components |
| `useNetworkState` | Detects browser connectivity | App |

The project does not use `useReducer`, `useMemo`, or `useDeferredValue` in the inspected source.

# Custom Hooks

### `useApi`

Fetches the general posts list with `GET /posts?sort=-createdAt`. It accepts no arguments and returns `{ data, isLoading, isError, error }`. Used by `Home.jsx`.

### `useLogout`

Accepts no arguments and returns a `logout` function. It removes `localStorage.token`, clears `AuthContext`, and navigates to `/login`. Used by `AsiadBar` and `Settings`.

### `useNotificationPolling`

Accepts `authToken`, fetches the first notification page and unread count, and refreshes both queries every 30 seconds while authenticated. It tracks known IDs with a ref and can show a toast for a newly detected unread item. Used by `Layout`.

### Related utilities

`fetchFollowSuggestions(limit = 10)` calls the suggestions endpoint, while `selectSuggestionUsers` normalizes its response. `queryKeys.js` centralizes query keys. `postCache.js` contains `invalidatePostViews` and `invalidateUserViews` to refresh related server views after mutations.

# Project Architecture

```text
React route component
        |
        v
Local state / Context / React Hook Form
        |
        v
TanStack Query or feature function
        |
        v
Axios request with Bearer token
        |
        v
Route Posts REST API
        |
        v
Query cache invalidation or cache update
        |
        v
Updated UI and toast feedback
```

- **Presentation:** Components under `src/Components` and `src/Auth` render pages, cards, forms, modals, navigation, and states.
- **Routing:** `App.jsx` creates a browser router with a shared `Layout`, nested routes, guards, and a router error element.
- **Authentication:** `AuthContext` loads the token, fetches profile data, and clears the session after HTTP 401.
- **Server state:** TanStack Query owns API results, mutation status, stale times, polling, and invalidation.
- **HTTP:** Axios calls are colocated with features; there is no separate `Services` directory or centralized Axios client.
- **Styling:** Tailwind classes are used in JSX, with global rules in `src/index.css`.

# Folder Structure

```text
.
├── docs/
│   └── Neno-X-Project-Documentation.html
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx, App.css, index.css, main.jsx
│   ├── assets/ (hero.png, logo-light.png, react.svg)
│   ├── Auth/ (Login, Register)
│   ├── Components/
│   │   ├── Layout, NavBar, AsiadBar, Footer, ScrollToTop
│   │   ├── Home, GetHomeFeed, GetProfilePosts, GetBookmarks
│   │   ├── Profile, UserProfile, DiscoverPeople, FollowSuggestions
│   │   ├── PostCard, PostDetails, CreatePost, EditPostModal, SharePost
│   │   ├── Comments, CommentCard, CommentReply, CreateComment, LikesModal
│   │   ├── Notifications, Settings, password/photo components
│   │   ├── ProtectAuth, ProtectRoute, Spinner, NotFound, RouteError
│   │   └── Other shared UI components
│   ├── Context/ (AuthContext and CounterContext)
│   ├── Hooks/ (API hooks, polling, cache, keys, suggestions, logout)
│   └── Schema/ (Login and Register Zod schemas)
├── index.html
├── eslint.config.js
├── vite.config.js
├── package.json
└── package-lock.json
```

`App.css` is currently empty. Global styling is in `index.css`, which imports Tailwind and defines Neno X color variables, page background, typography, focus styles, and reduced-motion behavior.

# Routing

| Route | Page | Description | Protected |
| --- | --- | --- | --- |
| `/` | Register | Create an account | No; token users redirect to `/home` |
| `/login` | Login | Sign in | No; token users redirect to `/home` |
| `/home` | Home | General feed and create-post surface | Yes |
| `/following-users` | GetHomeFeed | Feed limited to followed users | Yes |
| `/profile` | Profile | Current profile, posts, and bookmarks | Yes |
| `/users/:id` | UserProfile | Another user's profile and posts | Yes |
| `/details/:id` | PostDetails | One post and its comments | Yes |
| `/settings` | Settings | Photo, cover preview, password, logout | Yes |
| `/notifications` | Notifications | Notifications and read actions | Yes |
| `/follow-suggestions` | DiscoverPeople | Discover and follow suggested users | Yes |
| `*` | NotFound | Client-side 404 page | Shared layout |

The router uses `RouteError` as its `errorElement` for route failures. Dynamic routes are `/users/:id` and `/details/:id`.

# API Architecture

Feature components call Axios directly or through small feature helpers. Authenticated calls read `localStorage.getItem("token")` and send `Authorization: Bearer <token>`.

```text
Component -> feature function or custom hook -> TanStack Query
          -> Axios request -> Route Posts REST API
          -> response -> cache update/invalidation -> UI
```

There is no environment-based API client in the current implementation; the host is repeated as a literal in feature files.

# API Endpoints

The following paths are visible in the source. The host is `https://route-posts.routemisr.com`; no secret values are documented here.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/users/signup` | Register a user |
| `POST` | `/users/signin` | Log in and receive a token |
| `GET` | `/users/profile-data` | Load the authenticated user's profile |
| `PATCH` | `/users/change-password` | Change the password |
| `PUT` | `/users/upload-photo` | Upload a profile photo |
| `GET` | `/users/bookmarks` | Load saved posts |
| `GET` | `/users/suggestions?limit=10` | Load follow suggestions |
| `GET` | `/users/:id/profile` | Load another user's profile |
| `GET` | `/users/:id/posts` | Load a user's posts |
| `PUT` | `/users/:id/follow` | Toggle follow/unfollow |
| `GET` | `/posts?sort=-createdAt` | Load the general feed |
| `GET` | `/posts/feed?only=following&limit=10` | Load the following feed |
| `POST` | `/posts` | Create a text/image post |
| `GET` | `/posts/:id` | Load post details |
| `PUT` | `/posts/:id` | Edit a post |
| `DELETE` | `/posts/:id` | Delete a post |
| `PUT` | `/posts/:id/like` | Toggle a post like |
| `PUT` | `/posts/:id/bookmark` | Toggle a post bookmark |
| `POST` | `/posts/:id/share` | Share a post |
| `GET` | `/posts/:id/comments?page=1&limit=10` | Load comments |
| `POST` | `/posts/:id/comments` | Create a comment |
| `PUT` | `/posts/:id/comments/:commentId` | Edit a comment |
| `DELETE` | `/posts/:id/comments/:commentId` | Delete a comment |
| `PUT` | `/posts/:id/comments/:commentId/like` | Toggle a comment like |
| `GET` | `/posts/:id/comments/:commentId/replies?page=1&limit=10` | Load replies |
| `POST` | `/posts/:id/comments/:commentId/replies` | Create a reply |
| `GET` | `/posts/:id/likes?page=1&limit=20` | Load post likes |
| `GET` | `/notifications/unread-count` | Load unread count |
| `GET` | `/notifications?unread=false&page=1&limit=10` | Load notifications |
| `PATCH` | `/notifications/:notificationId/read` | Mark one notification as read |
| `PATCH` | `/notifications/read-all` | Mark all notifications as read |

# Authentication

1. Registration sends validated fields to `POST /users/signup`.
2. Login sends email and password to `POST /users/signin`.
3. The returned token is stored in `localStorage` under `token` and in `AuthContext` as `authToken`.
4. `AuthContextProvider` calls `GET /users/profile-data` to populate `userData`.
5. `ProtectRoute` checks `localStorage.token` and redirects unauthenticated users to `/login`.
6. `ProtectAuth` redirects authenticated users from login/register to `/home`.
7. An Axios response interceptor removes the token and clears user state on HTTP 401.
8. `useLogout` removes the token, clears context state, and navigates to `/login`.

The token is stored in browser `localStorage`, not an HTTP-only cookie. This README contains no API keys, passwords, tokens, or secret environment values.

# State Management

- **Local state:** Modals, menus, previews, pagination, form values, and pending UI.
- **`AuthContext`:** Shares `authToken`, `userData`, setters, and `getUserData`.
- **`CounterContext`:** Provides `counter` and `setCounter`; the provider is mounted in `App.jsx`.
- **TanStack Query:** Owns API data and cache keys for posts, profiles, comments, replies, likes, bookmarks, suggestions, and notifications.
- **Cache invalidation:** `postCache.js` refreshes related views after post, comment, follow, bookmark, or profile mutations.
- **Redux:** Not used by the project.

# Data Synchronization

### Likes and bookmarks

`PostCard` sends a `PUT` mutation, then `invalidatePostViews` invalidates post, profile-post, home-feed, bookmark, and relevant like queries. The UI refetches server data for counts and current state.

### Comments and replies

`CreateComment`, `CommentCard`, and `CommentReply` use `POST`, `PUT`, `DELETE`, and `PUT .../like` mutations. Successful actions invalidate comments, replies, post, and likes query keys.

### Follow

`FollowUser` toggles `PUT /users/:id/follow`, refreshes the authenticated user's profile, invalidates the current profile and suggestions, and refreshes shared user/post views.

### Notifications

`useNotificationPolling` refreshes notifications and unread count every 30 seconds while the tab is active. `Notifications` updates notification and unread-count cache data after marking one or all as read.

# Notifications

- Notifications are fetched with `GET /notifications?unread=false&page=<page>&limit=10`.
- The unread badge uses `GET /notifications/unread-count` and appears in `NavBar` and `AsiadBar`.
- The notification page supports pagination, target navigation, mark-one-as-read, and mark-all-as-read.
- Polling runs every 30 seconds and is disabled in background tabs.
- A newly detected unread notification can produce a `react-toastify` info toast.
- The code uses REST polling; there is no WebSocket, Socket.IO, or SSE implementation.

# Posts

`Home` uses `useApi` for newest posts. `GetHomeFeed` loads the following-only feed. `PostCard` displays author data, timestamps, media, interaction counts, bookmark state, follow action, and shared-post information.

Supported post actions are create text/image posts, read feeds/profile posts/bookmarks/details, edit/delete owned posts, like/unlike, bookmark/unbookmark, share, open comments, and view post likes. The code does not show category, featured-post, search, or related-post functionality.

# Comments

`CreateComment` submits text and optional image content with `FormData`. `CommentCard` supports replies, editing, deletion, and comment likes for valid IDs. `CommentReply` creates text/image replies and refreshes replies and parent-post views.

Loading, error, empty, validation, invalid-image, invalid-ID, and failed-mutation feedback is implemented where relevant through feature UI and toasts. There is no separate comment search or pagination control beyond the fixed API limits in the source.

# Likes

`PostCard` toggles a post like with `PUT /posts/:id/like`. `CommentCard` toggles comment likes with `PUT /posts/:id/comments/:commentId/like`. `LikesModal` fetches up to 20 post likes on open and provides loading, retry, linked user rows, and empty states.

# Follow System

`FollowUser` toggles follow/unfollow through `PUT /users/:id/follow`. The current user's `following` data determines the button state. On success, the app refreshes user data and invalidates profile, post, suggestions, and related query views. Profiles expose follower and following counts.

# Follow Suggestions

`fetchFollowSuggestions` calls `GET /users/suggestions?limit=10`. Suggestions appear in the home/following-feed sidebars through `FollowSuggestions` and on `/follow-suggestions` through `DiscoverPeople` cards. Both views provide loading, error, and empty states. Each suggestion links to `/users/:id` and contains a `FollowUser` action. The query uses a 60-second stale time and is invalidated after follow/unfollow.

# UI / UX

- `Layout` combines `NavBar`, authenticated desktop `AsiadBar`, routed content, `Footer`, page titles, and scroll-to-top behavior.
- `NavBar` provides desktop navigation, account information, unread badge, and a collapsible mobile menu.
- Cards are used for posts, profiles, suggestions, notifications, forms, and settings sections.
- Modals are used for creating/editing posts and viewing post likes; `LikesModal` uses a portal.
- Forms show validation errors, disabled pending states, image previews, and toast feedback.
- `index.css` defines page background, Neno X color variables, focus outlines, smooth scrolling, and reduced-motion behavior.
- No dark/light theme switch is implemented in the inspected source.

# Responsive Design

Tailwind responsive utilities support mobile, tablet, laptop, and desktop widths. The desktop sidebar is hidden below `lg`, the navbar switches to a mobile menu below `lg`, and home/following feeds use one column on smaller screens and a feed/sidebar grid at `xl`. Profile cards, settings forms, suggestions, notifications, and post layouts adjust padding, columns, and typography. Several content images use lazy loading and asynchronous decoding.

# Error Handling

Implemented handling includes browser offline detection, HTTP 401 session clearing, query loading/error states, selected retry actions, Zod/React Hook Form errors, mutation toasts, the wildcard `NotFound` page, and router-level `RouteError`.

There are no dedicated frontend branches for every HTTP status such as 400, 403, 409, 422, or 500. Most non-401 API failures use a feature-level generic message or toast.

# Performance

- TanStack Query caching and centralized query keys avoid duplicate server copies.
- `App.jsx` configures a 30-second default `staleTime`, one retry for network-like query failures, no mutation retries, and no refetch on window focus.
- Follow suggestions use a 60-second stale time.
- `postCache.js` provides targeted invalidation after mutations.
- Notification polling is disabled in background tabs.
- Several images use `loading="lazy"` and `decoding="async"`.
- Object URLs are revoked when local image previews are removed/unmounted.

The source does not show component memoization, `useMemo`, route-level lazy loading, code splitting, or optimistic updates.

# Security

- Protected routes require a token before rendering.
- Authenticated API calls use Bearer authorization headers.
- A 401 response clears the client session.
- Login and registration have client-side validation.
- No secrets are committed to this README.

Because the token is stored in `localStorage`, production deployments should evaluate the application's XSS threat model and backend/API security policy before treating this storage approach as sufficient.

# Environment Variables

No `.env` files or `VITE_*` variables were found in the repository. The API host is currently hard-coded:

```text
https://route-posts.routemisr.com
```

`VITE_API_URL` is not a required variable in the current project. It could be introduced later if the API host is externalized.

# Getting Started

## Prerequisites

- Node.js with npm.
- Network access to the Route Posts API.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Preview and lint

```bash
npm run preview
npm run lint
```

# Configuration Files

- `vite.config.js` registers the React and Tailwind Vite plugins.
- `eslint.config.js` enables recommended JavaScript, React Hooks, and React Refresh rules and ignores `dist`.
- `index.html` defines browser metadata, favicon, viewport, theme color, and the root element.
- `src/main.jsx` mounts the app inside `React.StrictMode`.

# Current Implementation Notes

- The official project name in this README is **Neno X**. Some existing browser metadata and image alt text still use older names such as `Connectly` or `Venox`.
- `ChangeCoverPhoto` currently provides local preview and remove-preview behavior; it does not contain an API upload mutation.
- API requests are colocated with feature components rather than extracted into a shared services layer.
- The repository includes `docs/Neno-X-Project-Documentation.html` as an additional project document.
