export type DemoId =
  | "async-primitives"
  | "activity"
  | "effect-event"
  | "view-transition"
  | "transition-types"
  | "fragment-refs"
  | "browser"
  | "on-navigate"
  | "link-status"
  | "link-transition-types";

export type Feature = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  problem: string;
  before: string;
  after: string;
  useWhen: string;
  avoidWhen: string;
  docs: { label: string; url: string }[];
  demo?: DemoId;
  contextOnly?: boolean;
};

export type Release = {
  id: string;
  name: string;
  family: "React" | "Next.js";
  description: string;
  blog: string;
  note?: string;
  emptyNote?: string;
  features: Feature[];
};

export const releases: Release[] = [
  {
    id: "react-19-3",
    name: "React 19.3",
    family: "React",
    description:
      "Stable view transitions, refs for Fragments, browser-only rendering, and safer HTML integrations.",
    blog: "https://react.dev/blog/2026/09/09/react-19-3",
    features: [
      {
        slug: "view-transitions",
        title: "<ViewTransition>",
        short:
          "Coordinate enter, exit, and update animations with React transitions.",
        intro:
          "The new ViewTransition component connects React updates to the browser View Transition API. Wrap changing UI and React can animate elements as they appear, disappear, move, or update.",
        problem:
          "Hand-written enter/exit animations often lose track of DOM snapshots during concurrent rendering, Suspense reveals, or state changes. A wrapper gives React the context to coordinate those snapshots with a transition.",
        before: String.raw`const [open, setOpen] = useState(false);

return (
  <>
    <button onClick={() => setOpen(!open)}>Toggle</button>
    {open && <ProfileCard />}
  </>
);`,
        after: String.raw`import { ViewTransition, startTransition } from "react";

startTransition(() => setOpen((value) => !value));

return (
  <ViewTransition>
    {open && <ProfileCard />}
  </ViewTransition>
);`,
        useWhen:
          "A state transition changes a meaningful piece of UI and a short, coordinated animation helps explain the change.",
        avoidWhen:
          "The update is urgent, the content should appear instantly, or motion would distract. Respect reduced-motion preferences and keep fallbacks immediate.",
        docs: [
          {
            label: "React: ViewTransition",
            url: "https://react.dev/reference/react/ViewTransition",
          },
          {
            label: "React 19.3 release post",
            url: "https://react.dev/blog/2026/09/09/react-19-3#view-transitions",
          },
        ],
        demo: "view-transition",
      },
      {
        slug: "transition-types",
        title: "addTransitionType",
        short:
          "Tag why a transition happened so animations can reflect its direction or intent.",
        intro:
          "addTransitionType(type) attaches a label to the current React Transition. A ViewTransition can map each label to a different enter or exit animation.",
        problem:
          "The same state can be reached through different actions. A carousel moving forward and backward changes the same index, but should not necessarily animate in the same direction.",
        before: String.raw`function next() {
  startTransition(() => setIndex((n) => n + 1));
}

function previous() {
  startTransition(() => setIndex((n) => n - 1));
}`,
        after: String.raw`import { addTransitionType } from "react";

function next() {
  startTransition(() => {
    addTransitionType("next");
    setIndex((n) => n + 1);
  });
}

<ViewTransition enter={{ default: "none", next: "from-right" }}>`,
        useWhen:
          "The origin or direction of an update should select a different View Transition animation.",
        avoidWhen:
          "A default animation is enough, or the update is not wrapped in a React Transition. Types describe transitions; they are not persistent state.",
        docs: [
          {
            label: "React: addTransitionType",
            url: "https://react.dev/reference/react/addTransitionType",
          },
          {
            label: "React 19.3 release post",
            url: "https://react.dev/blog/2026/09/09/react-19-3#add-transition-type",
          },
        ],
        demo: "transition-types",
      },
      {
        slug: "fragment-refs",
        title: "Fragment refs",
        short:
          "Observe, focus, and interact with a group of sibling DOM nodes without a wrapper.",
        intro:
          "An explicit <Fragment ref={...}> provides a FragmentInstance with methods for working with its first-level DOM children as a group. It can observe them, manage events and focus, and measure or scroll them.",
        problem:
          "A component that renders siblings has no single DOM element to receive a ref. Adding a wrapper just for observation or focus can change layout, semantics, or styling.",
        before: String.raw`return (
  <div ref={containerRef}>
    <Card />
    <Card />
  </div>
);

// The extra div may affect layout or semantics.`,
        after: String.raw`import { Fragment, useRef } from "react";

const groupRef = useRef(null);

return (
  <Fragment ref={groupRef}>
    <Card />
    <Card />
  </Fragment>
);

groupRef.current?.observeUsing(intersectionObserver);`,
        useWhen:
          "A component exposes sibling elements and a consumer needs grouped observation, focus management, events, or geometry without changing the DOM.",
        avoidWhen:
          "A normal element ref is simpler, or you need to observe arbitrary nested descendants as a single box. Fragment refs operate on first-level DOM children for many methods.",
        docs: [
          {
            label: "React: Fragment and FragmentInstance",
            url: "https://react.dev/reference/react/Fragment#fragmentinstance",
          },
          {
            label: "React 19.3 release post",
            url: "https://react.dev/blog/2026/09/09/react-19-3#fragment-refs",
          },
        ],
        demo: "fragment-refs",
      },
      {
        slug: "browser",
        title: "browser() with use",
        short:
          "Render browser-dependent UI only after hydration, with a Suspense fallback in server HTML.",
        intro:
          "React DOM's browser() returns a marker that a Client Component can pass to use(). Server rendering suspends at that point; in the browser, use(browser()) resolves and the component continues.",
        problem:
          "A mounted-state Effect or a typeof window check can produce placeholder markup, duplicate rendering logic, or hydration mismatches for content that has no meaningful server version.",
        before: String.raw`const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);
if (!mounted) return <Spinner />;

return <p>{localStorage.getItem("draft")}</p>;`,
        after: String.raw`import { use } from "react";
import { browser } from "react-dom";

function SavedDraft() {
  use(browser());
  return <Editor initialValue={localStorage.getItem("draft") ?? ""} />;
}

<Suspense fallback={<Spinner />}>
  <SavedDraft />
</Suspense>`,
        useWhen:
          "A Client Component genuinely depends on browser-only data, such as localStorage or the user's local time zone, and cannot render useful server HTML.",
        avoidWhen:
          "The content can render on the server or can be passed in as initial data. browser() requires a Client Component and a Suspense boundary during server rendering.",
        docs: [
          {
            label: "React DOM: browser",
            url: "https://react.dev/reference/react-dom/browser",
          },
          { label: "React: use", url: "https://react.dev/reference/react/use" },
        ],
        demo: "browser",
      },
      {
        slug: "trusted-types",
        title: "Trusted Types support",
        short:
          "Preserve TrustedHTML and related values so strict browser policies can validate them.",
        intro:
          "React 19.3 passes Trusted Types objects through to DOM injection sinks without first coercing them to strings. This makes React compatible with browser policies that require trusted values for script-related sinks.",
        problem:
          "String coercion turns a TrustedHTML value back into an ordinary string, which a browser enforcing require-trusted-types-for 'script' can reject.",
        before: String.raw`// React converted the trusted object to a string
// before passing it to the browser sink.
const safeHtml = policy.createHTML(untrustedInput);

return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;`,
        after: String.raw`// React preserves the TrustedHTML object.
const policy = trustedTypes.createPolicy("app-html", {
  createHTML: (input) => sanitize(input),
});

const safeHtml = policy.createHTML(untrustedInput);
return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;`,
        useWhen:
          "Your application uses a Trusted Types Content Security Policy and deliberately sanitizes untrusted HTML through a named policy.",
        avoidWhen:
          "You are looking for a sanitizer or an automatic XSS fix. Trusted Types enforcement and a correct sanitization policy are still application responsibilities.",
        docs: [
          {
            label: "React 19.3 release post",
            url: "https://react.dev/blog/2026/09/09/react-19-3#trusted-types-support",
          },
          {
            label: "MDN: Trusted Types API",
            url: "https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API",
          },
        ],
      },
      {
        slug: "server-context",
        title: "Render Context directly in Server Components",
        short:
          "A Server Component can render a Context imported from a Client Component module.",
        intro:
          "A Server Component can now import a Context object defined in a 'use client' module and render it directly as a provider. The Server Component still cannot create the Context itself.",
        problem:
          "Previously, a tiny Client Component was needed just to receive a value from a Server Component and pass it into Context for the client tree.",
        before: String.raw`// user-context.tsx ("use client")
export function UserProvider({ value, children }) {
  return <UserContext value={value}>{children}</UserContext>;
}

// Server Component
<UserProvider value={user}>{children}</UserProvider>`,
        after: String.raw`// user-context.tsx ("use client")
export const UserContext = createContext<User | null>(null);

// Server Component
import { UserContext } from "./user-context";

return <UserContext value={user}>{children}</UserContext>;`,
        useWhen:
          "A Server Component already has the value and only needs to provide it to Client Components below it.",
        avoidWhen:
          "You need to create Context in a Server Component, or a provider has meaningful client-side behavior. Keep the Context definition in a Client Component module.",
        docs: [
          {
            label: "React 19.3 release post",
            url: "https://react.dev/blog/2026/09/09/react-19-3#context-can-be-rendered-directly-in-server-components",
          },
          {
            label: "React: createContext",
            url: "https://react.dev/reference/react/createContext",
          },
        ],
      },
    ],
  },
  {
    id: "react-19-2",
    name: "React 19.2",
    family: "React",
    description:
      "Keep hidden UI ready without losing state, separate Effect events, and control server rendering lifetimes.",
    blog: "https://react.dev/blog/2025/10/01/react-19-2",
    note: "Scope check: use(), Suspense, and useTransition are useful async primitives, but they were not introduced in React 19.2. They are included below as context; the release-specific additions are Activity, useEffectEvent, cacheSignal, and the server-rendering APIs.",
    features: [
      {
        slug: "async-primitives",
        title: "Async primitives: use, Suspense, and transitions",
        short:
          "Read a promise during render and let Suspense own the pending UI. These APIs predate 19.2.",
        intro:
          "React's use(promise) reads a promise during render: pending work suspends to the nearest Suspense boundary, fulfillment returns the value, and rejection reaches an Error Boundary. useTransition marks non-urgent updates and exposes pending state. These are important foundations for the newer features, not additions in React 19.2.",
        problem:
          "Without a shared rendering model, each async component tends to invent its own loading state and request lifecycle, making nested pending UI and transitions hard to coordinate.",
        before: String.raw`useEffect(() => {
  let active = true;
  fetch("/api/profile")
    .then((response) => response.json())
    .then((profile) => active && setProfile(profile));
  return () => { active = false; };
}, []);`,
        after: String.raw`function Profile({ promise }) {
  const profile = use(promise);
  return <h2>{profile.name}</h2>;
}

<Suspense fallback={<ProfileSkeleton />}>
  <Profile promise={stableProfilePromise} />
</Suspense>

// Use a Transition when changing to another resource
// should keep the current screen visible while it loads.`,
        useWhen:
          "A framework or resource cache provides a stable promise, and a Suspense fallback is the right boundary for its pending UI.",
        avoidWhen:
          "A promise is created on every render, there is no Suspense boundary, or the data library does not support Suspense. Do not treat use() as a general replacement for event-handler awaits.",
        docs: [
          { label: "React: use", url: "https://react.dev/reference/react/use" },
          {
            label: "React: Suspense",
            url: "https://react.dev/reference/react/Suspense",
          },
          {
            label: "React: useTransition",
            url: "https://react.dev/reference/react/useTransition",
          },
        ],
        demo: "async-primitives",
        contextOnly: true,
      },
      {
        slug: "activity",
        title: "<Activity>",
        short:
          "Hide a screen while preserving its state and deferring its background updates.",
        intro:
          "Activity renders a subtree in visible or hidden mode. Hidden content stays mounted with its state preserved, its Effects are cleaned up, and its updates are deprioritized.",
        problem:
          "Unmounting a tab or route discards local state; leaving it mounted and visible wastes space and can keep Effects running. Activity provides a middle ground.",
        before: String.raw`{activeTab === "settings" && <Settings />}

// Leaving the tab unmounts Settings and loses its local state.`,
        after: String.raw`<Activity mode={activeTab === "settings" ? "visible" : "hidden"}>
  <Settings />
</Activity>

// Hidden content keeps state, but its Effects are unmounted.`,
        useWhen:
          "A likely next screen, tab, or recently hidden panel should retain its local state and be prepared in the background.",
        avoidWhen:
          "The subtree is large and unlikely to be revisited, or its hidden Effects must continue running. Hidden Activity is not a replacement for data caching.",
        docs: [
          {
            label: "React: Activity",
            url: "https://react.dev/reference/react/Activity",
          },
          {
            label: "React 19.2 release post",
            url: "https://react.dev/blog/2025/10/01/react-19-2#activity",
          },
        ],
        demo: "activity",
      },
      {
        slug: "use-effect-event",
        title: "useEffectEvent",
        short:
          "Read the latest props and state in Effect callbacks without restarting the Effect.",
        intro:
          "useEffectEvent extracts non-reactive logic from an Effect. Its function sees the latest props and state, while changes to those values do not re-run the Effect that registered it.",
        problem:
          "An Effect may subscribe to an external system using one value, but its callback also needs current presentation state. Adding every callback-only value as a dependency can unnecessarily reconnect the system.",
        before: String.raw`useEffect(() => {
  const connection = createConnection(roomId);
  connection.on("connected", () => {
    showNotification("Connected", theme);
  });
  connection.connect();
  return () => connection.disconnect();
}, [roomId, theme]); // Changing theme reconnects.`,
        after: String.raw`const onConnected = useEffectEvent(() => {
  showNotification("Connected", theme);
});

useEffect(() => {
  const connection = createConnection(roomId);
  connection.on("connected", onConnected);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);`,
        useWhen:
          "An external event emitted by an Effect needs the latest UI values, but those values should not control the subscription lifecycle.",
        avoidWhen:
          "The value actually determines when the Effect should resynchronize, or the callback is a user event handler. Effect Events are only called from Effects and are not dependencies.",
        docs: [
          {
            label: "React: useEffectEvent",
            url: "https://react.dev/reference/react/useEffectEvent",
          },
          {
            label: "React 19.2 release post",
            url: "https://react.dev/blog/2025/10/01/react-19-2#useeffectevent",
          },
        ],
        demo: "effect-event",
      },
      {
        slug: "cache-signal",
        title: "cacheSignal",
        short:
          "Tie server-side work such as fetch cancellation to the lifetime of a React cache render.",
        intro:
          "cacheSignal() returns an AbortSignal that is aborted when the current server render's cache lifetime ends, including when rendering completes, fails, or is abandoned.",
        problem:
          "A server render can stop needing a pending request, but without a render-scoped signal the request may keep consuming resources after its result is no longer useful.",
        before: String.raw`async function Page() {
  const response = await fetch(url);
  return <Result data={await response.json()} />;
}

// The request has no signal tied to render lifetime.`,
        after: String.raw`import { cacheSignal } from "react";

async function Page() {
  const response = await fetch(url, { signal: cacheSignal() });
  return <Result data={await response.json()} />;
}`,
        useWhen:
          "A React Server Component starts cancelable work whose result is only useful for the current cache/render lifetime.",
        avoidWhen:
          "In Client Components, outside React's server cache lifetime, or when work must outlive the render. Prefer the runtime's normal request signal when that is the intended owner.",
        docs: [
          {
            label: "React: cacheSignal",
            url: "https://react.dev/reference/react/cacheSignal",
          },
          {
            label: "React 19.2 release post",
            url: "https://react.dev/blog/2025/10/01/react-19-2#cache-signal",
          },
        ],
      },
      {
        slug: "partial-prerendering",
        title: "Partial pre-rendering and resume APIs",
        short:
          "Send a static shell first, then resume rendering the deferred parts.",
        intro:
          "React's static and server renderers can save postponed state while producing a pre-rendered shell, then resume that render later for streaming or a fully static result.",
        problem:
          "A page may combine stable content that can be served ahead of time with data that is only available later. Rendering everything at once loses the opportunity to send the stable shell early.",
        before: String.raw`const html = renderToString(<App />); // all at once

// Dynamic work must finish before the response is useful.`,
        after: String.raw`const { prelude, postponed } = await prerender(<App />, {
  signal: controller.signal,
});
await savePostponedState(postponed);
sendShell(prelude);

const stream = await resume(<App />, postponed);
sendStream(stream);`,
        useWhen:
          "You are building or integrating a server renderer that can persist postponed state and serve a static shell separately from dynamic content.",
        avoidWhen:
          "You are using a framework that already owns its rendering pipeline. In Node.js, React recommends the Node stream APIs for server rendering.",
        docs: [
          {
            label: "React DOM: prerender",
            url: "https://react.dev/reference/react-dom/static/prerender",
          },
          {
            label: "React DOM: resume",
            url: "https://react.dev/reference/react-dom/server/resume",
          },
          {
            label: "React 19.2 release post",
            url: "https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering",
          },
        ],
      },
      {
        slug: "node-web-streams",
        title: "Web Streams for Node.js SSR",
        short:
          "Use the Web Streams render and resume APIs in a Node.js server.",
        intro:
          "React 19.2 makes renderToReadableStream, prerender, resume, and resumeAndPrerender available in Node.js, so applications can use the standard Web Streams interfaces there.",
        problem:
          "A renderer that needs a Web ReadableStream previously had to choose another runtime or convert from Node streams.",
        before: String.raw`import { renderToPipeableStream } from "react-dom/server";

// The Node renderer produces a Node.js stream.`,
        after: String.raw`import { renderToReadableStream } from "react-dom/server";

const stream = await renderToReadableStream(<App />);
return new Response(stream, {
  headers: { "content-type": "text/html" },
});`,
        useWhen:
          "Your Node.js integration is built around the Web Streams API or a Web Response.",
        avoidWhen:
          "A Node server already consumes Node streams. React still recommends its Node stream APIs there; Web Streams do not provide compression by default.",
        docs: [
          {
            label: "React DOM: renderToReadableStream",
            url: "https://react.dev/reference/react-dom/server/renderToReadableStream",
          },
          {
            label: "React 19.2 release post",
            url: "https://react.dev/blog/2025/10/01/react-19-2#ssr-web-streams-support-for-node",
          },
        ],
      },
    ],
  },
  {
    id: "next-16-4",
    name: "Next.js 16.4",
    family: "Next.js",
    description:
      "Cache Components are ready for new apps, with explicit static guarantees and finer control over staged navigation work.",
    blog: "https://nextjs.org/blog/next-16-4",
    note: "Cache Components are enabled by default in newly created apps from create-next-app. They are not yet the universal default for every existing Next.js project; the 16.4 post says that broader default is planned for 17.",
    features: [
      {
        slug: "ensure-static",
        title: "ensureStatic",
        short:
          "Make the shell, prefetch, or complete navigation fail if it becomes request-rendered.",
        intro:
          "Export ensureStatic from a page or layout to require a specific navigation stage to remain static: 'shell', 'prefetch', or 'navigation'. It guards against future changes accidentally adding request-time rendering.",
        problem:
          "A route intended to stay static can silently become dynamic as the codebase changes, increasing server work or weakening the delivery guarantees the team expects.",
        before: String.raw`// No guard: a later change can add
// request-time data to this route.`,
        after: String.raw`// app/blog/layout.tsx
export const ensureStatic = "navigation";

export default function Layout({ children }) {
  return <>{children}</>;
}`,
        useWhen:
          "A marketing, catalog, or publishing route must keep its shell, prefetch, or full server output static as a build-time contract.",
        avoidWhen:
          "The route intentionally depends on request-time data. ensureStatic requires cacheComponents and the chosen stage must be compatible with the route.",
        docs: [
          {
            label: "Next.js: ensureStatic",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/ensureStatic",
          },
          {
            label: "Next.js 16.4 release post",
            url: "https://nextjs.org/blog/next-16-4#ensuring-shells-prefetches-or-pages-are-static",
          },
        ],
      },
      {
        slug: "defer-navigation-work",
        title: "navigation() and prefetch()",
        short:
          "Choose whether expensive work belongs in the shared shell, per-link prefetch, or final navigation.",
        intro:
          "Under Cache Components and Partial Prefetching, await navigation() to keep a subtree out of the shell and per-link prefetch; await prefetch() to keep it out of the shell but allow it during an explicit per-link prefetch.",
        problem:
          "Prefetching every byte of a destination can do expensive server work for pages a user never opens. Disabling prefetch entirely throws away useful cached and shared UI.",
        before: String.raw`async function Thread({ id }) {
  const messages = await getEntireThread(id);
  return <MessageList messages={messages} />;
}

// The thread is part of every prefetch.`,
        after: String.raw`import { navigation } from "next/cache";

async function Thread({ id }) {
  await navigation();
  const messages = await getThread(id);
  return <MessageList messages={messages} />;
}

// Wrap the deferred subtree in Suspense.`,
        useWhen:
          "A costly subtree should wait until the user navigates, or should be fetched only when a specific link opts into deeper prefetching.",
        avoidWhen:
          "The data is needed for an instant shell or a particular link should show the completed UI immediately. These APIs require Cache Components; use Suspense fallbacks for deferred content.",
        docs: [
          {
            label: "Next.js: navigation",
            url: "https://nextjs.org/docs/app/api-reference/functions/navigation",
          },
          {
            label: "Next.js: prefetch",
            url: "https://nextjs.org/docs/app/api-reference/functions/prefetch",
          },
          {
            label: "Next.js: optimizing prefetching",
            url: "https://nextjs.org/docs/app/guides/optimizing-prefetching",
          },
        ],
      },
      {
        slug: "react-19-3-support",
        title: "Stable React 19.3 support",
        short:
          "Next.js 16.4 ships React 19.3 and its stable View Transitions and Fragment refs.",
        intro:
          "Next.js 16.4 updates its App Router integration to React 19.3. That makes the stable React 19.3 APIs available to Next.js applications, including ViewTransition, addTransitionType, Fragment refs, and browser().",
        problem:
          "Framework integrations need to adopt React's renderer changes before applications can rely on newly stabilized APIs in their normal App Router workflows.",
        before: String.raw`// Earlier Next.js 16 releases used React 19.2
// plus newer React canary features.`,
        after: String.raw`// Next.js 16.4 ships React 19.3
import { ViewTransition } from "react";

<ViewTransition>
  <ProductDetails />
</ViewTransition>`,
        useWhen:
          "You are on Next.js 16.4 and want to use React 19.3 APIs in a supported App Router project.",
        avoidWhen:
          "You need a feature before upgrading the framework or assume every React API is enabled by Next.js navigation automatically. Check the React and Next.js integration docs for each API.",
        docs: [
          {
            label: "Next.js 16.4 release post",
            url: "https://nextjs.org/blog/next-16-4#react-193",
          },
          {
            label: "React 19.3 release post",
            url: "https://react.dev/blog/2026/09/09/react-19-3",
          },
        ],
        demo: "view-transition",
      },
    ],
  },
  {
    id: "next-16-3",
    name: "Next.js 16.3",
    family: "Next.js",
    description:
      "Instant Navigations combine an immediately available route shell with streamed or cached server content.",
    blog: "https://nextjs.org/blog/next-16-3-instant-navigations",
    features: [
      {
        slug: "instant-navigations",
        title: "Instant Navigations and Partial Prefetching",
        short:
          "Show a reusable route shell immediately, then stream or cache the remaining server UI.",
        intro:
          "With Cache Components and Partial Prefetching enabled, Next.js can prefetch a reusable shell per route. Suspense streams dynamic UI into its fallback, while 'use cache' makes reusable results available sooner. A route can opt out of instant-navigation validation with instant = false.",
        problem:
          "A server-driven navigation may appear to do nothing until the whole request returns. Prefetching every link's entire page can also duplicate shared work.",
        before: String.raw`export default async function Page() {
  const data = await fetchDashboard();
  return <Dashboard data={data} />;
}

// The page waits for this request before
// it can show meaningful destination UI.`,
        after: String.raw`export default function Page() {
  return (
    <>
      <DashboardShell />
      <Suspense fallback={<DashboardSkeleton />}>
        <LiveDashboard />
      </Suspense>
    </>
  );
}

async function LiveDashboard() {
  await connection();
  return <Dashboard data={await fetchDashboard()} />;
}`,
        useWhen:
          "Users benefit from seeing the destination structure immediately while dynamic content streams in or cached UI is reused.",
        avoidWhen:
          "A route should deliberately block until all data is ready, or the shell would be misleading. Keep the route blocking intentionally rather than adding a loading state that implies incorrect content.",
        docs: [
          {
            label: "Next.js: instant navigation guide",
            url: "https://nextjs.org/docs/app/guides/instant-navigation",
          },
          {
            label: "Next.js: Partial Prefetching",
            url: "https://nextjs.org/docs/app/guides/adopting-partial-prefetching",
          },
          {
            label: "Next.js 16.3 release post",
            url: "https://nextjs.org/blog/next-16-3-instant-navigations",
          },
        ],
      },
    ],
  },
  {
    id: "next-16-2",
    name: "Next.js 16.2",
    family: "Next.js",
    description:
      "Add transition intent to links, place framework-aware error boundaries in component trees, and integrate custom build adapters.",
    blog: "https://nextjs.org/blog/next-16-2",
    features: [
      {
        slug: "link-transition-types",
        title: "transitionTypes on next/link",
        short:
          "Tag an App Router navigation so React View Transitions can animate it by intent.",
        intro:
          "The App Router Link component accepts transitionTypes, an array passed to React's addTransitionType during navigation. CSS or React ViewTransition props can then distinguish navigation types.",
        problem:
          "A route change can have different causes—such as moving to the next item or returning to a previous one—but a plain Link does not express that intent to transition animations.",
        before: String.raw`<Link href="/about">About</Link>

// The navigation has no transition label.`,
        after: String.raw`<Link href="/about" transitionTypes={["slide"]}>
  About
</Link>

// App Router only; Pages Router ignores the prop.`,
        useWhen:
          "You use the App Router with React View Transitions and need navigation-specific enter/exit styling.",
        avoidWhen:
          "You are using the Pages Router, or the destination should not have a distinct transition. The prop does not itself define an animation.",
        docs: [
          {
            label: "Next.js: Link transitionTypes",
            url: "https://nextjs.org/docs/app/api-reference/components/link#transitiontypes",
          },
          {
            label: "React: addTransitionType",
            url: "https://react.dev/reference/react/addTransitionType",
          },
        ],
        demo: "link-transition-types",
      },
      {
        slug: "catch-error",
        title: "Component-level error boundaries",
        short: "Wrap a subtree in a Next.js-aware boundary with retry support.",
        intro:
          "Next.js 16.2 introduced this component-level error-boundary API as unstable_catchError(). In the current 16.4 API it is catchError(); it works with Next.js navigation and recovery, handles framework control-flow errors such as redirect and notFound, and exposes retry and reset actions.",
        problem:
          "A route-level error.js boundary may be too broad, while a handwritten React boundary does not automatically understand Next.js's server rendering and navigation recovery.",
        before: String.raw`// A custom React boundary needs its own
// reset logic and does not know Next.js
// redirect/notFound control flow.`,
        after: String.raw`"use client";
import { catchError, type ErrorInfo } from "next/error";

function Fallback(props, { error, retry }: ErrorInfo) {
  return (
    <section>
      <h2>{props.title}</h2>
      <p>{String(error)}</p>
      <button onClick={retry}>Try again</button>
    </section>
  );
}

export default catchError(Fallback);`,
        useWhen:
          "A specific widget or subtree needs isolated recovery that can retry its server render without replacing the whole route.",
        avoidWhen:
          "The error should replace the entire route or root layout; use the error.js or global-error.js convention for those boundaries. The fallback must be a Client Component.",
        docs: [
          {
            label: "Next.js: catchError",
            url: "https://nextjs.org/docs/app/api-reference/functions/catchError",
          },
          {
            label: "Next.js: error.js",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/error",
          },
        ],
      },
      {
        slug: "build-adapters",
        title: "Build Adapters API",
        short:
          "Let a deployment platform customize Next.js build output through a supported adapter hook.",
        intro:
          "The Adapters API lets deployment platforms and build systems participate in the Next.js build process, inspect or transform outputs, and integrate runtime-specific behavior. It became stable in 16.2.",
        problem:
          "Platforms previously had to rely on undocumented build internals or maintain fragile post-build scripts to package Next.js for their environment.",
        before: String.raw`// A deployment integration post-processes
// generated files with private assumptions
// about Next.js build output.`,
        after: String.raw`// next.config.js
const nextConfig = {
  adapterPath: require.resolve("./my-adapter.js"),
};

module.exports = nextConfig;`,
        useWhen:
          "You build a deployment platform, hosting integration, or custom build system that needs a supported Next.js build hook.",
        avoidWhen:
          "You are building an application for an existing platform. Most app developers should not author or configure a custom adapter.",
        docs: [
          {
            label: "Next.js: adapterPath",
            url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath",
          },
          {
            label: "Next.js: Adapters API",
            url: "https://nextjs.org/docs/app/api-reference/adapters",
          },
        ],
      },
    ],
  },
  {
    id: "next-16-1",
    name: "Next.js 16.1",
    family: "Next.js",
    description:
      "A developer-workflow release centered on Turbopack caching, bundle analysis, and easier debugging.",
    blog: "https://nextjs.org/blog/next-16-1",
    emptyNote:
      "The 16.1 release post's highlights are build/startup performance, bundle analysis, and debugging improvements. Those are intentionally outside this feature guide's scope.",
    features: [],
  },
  {
    id: "next-16",
    name: "Next.js 16",
    family: "Next.js",
    description:
      "A more explicit server-rendering model, request interception through proxy.ts, and clearer cache invalidation semantics.",
    blog: "https://nextjs.org/blog/next-16",
    note: "Cache Components are opt-in through cacheComponents in Next.js 16; the 16.4 create-next-app default is covered separately on that release page.",
    features: [
      {
        slug: "cache-components",
        title: "Cache Components and 'use cache'",
        short:
          "Compose cached, static, and request-time UI explicitly in the same route.",
        intro:
          "Cache Components unify the 'use cache' directive, cache lifetimes, and Partial Prerendering. With cacheComponents enabled, dynamic code runs at request time by default; cache only the functions, components, or routes that should be reused.",
        problem:
          "Implicit caching can make it hard to predict which data is reused and which work runs for each request. A route-level static/dynamic choice also makes mixed pages awkward.",
        before: String.raw`export const revalidate = 3600;

export default async function Page() {
  const publicData = await getPublicData();
  const user = await getCurrentUser();
  return <Dashboard data={publicData} user={user} />;
}`,
        after: String.raw`async function PublicCatalog() {
  "use cache";
  cacheLife("hours");
  return <Catalog items={await getPublicData()} />;
}

export default async function Page() {
  const user = await getCurrentUser(); // request-time
  return <Dashboard user={user}><PublicCatalog /></Dashboard>;
}`,
        useWhen:
          "A route mixes reusable data with request-specific UI, and you want to make each cache boundary and lifetime explicit.",
        avoidWhen:
          "You have not enabled Cache Components or cannot safely cache data for the users who receive it. Pass user-specific inputs deliberately and review authorization at the cache boundary.",
        docs: [
          {
            label: "Next.js: use cache",
            url: "https://nextjs.org/docs/app/api-reference/directives/use-cache",
          },
          {
            label: "Next.js: Cache Components config",
            url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents",
          },
          {
            label: "Next.js: caching guide",
            url: "https://nextjs.org/docs/app/getting-started/caching",
          },
        ],
      },
      {
        slug: "proxy",
        title: "proxy.ts replaces middleware.ts",
        short:
          "Make the request interception boundary explicit; Proxy runs on the Node.js runtime.",
        intro:
          "Next.js 16 renames the middleware file convention to proxy.ts and its exported function to proxy. It clarifies that this code runs at the network boundary on Node.js; middleware.ts remains available for legacy Edge cases but is deprecated for removal.",
        problem:
          "The middleware name obscured where code ran and left developers with unclear runtime expectations for request interception.",
        before: String.raw`// middleware.ts
export function middleware(request) {
  return NextResponse.redirect(new URL("/home", request.url));
}`,
        after: String.raw`// proxy.ts
export function proxy(request) {
  return NextResponse.redirect(new URL("/home", request.url));
}`,
        useWhen:
          "A request needs an early redirect, rewrite, header/cookie adjustment, or other logic at the framework's network boundary.",
        avoidWhen:
          "The logic depends on shared render state, database work better done in a Server Action or Route Handler, or the feature can be handled in the page itself. Proxy is not a replacement for application authorization.",
        docs: [
          {
            label: "Next.js: Proxy",
            url: "https://nextjs.org/docs/app/getting-started/proxy",
          },
          {
            label: "Next.js: proxy.js reference",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/proxy",
          },
        ],
      },
      {
        slug: "cache-invalidation",
        title: "updateTag, refresh, and revalidateTag",
        short:
          "Choose read-your-writes, uncached refresh, or stale-while-revalidate behavior.",
        intro:
          "Next.js 16 adds updateTag() for immediate read-your-writes invalidation in Server Actions and refresh() to refresh uncached data. revalidateTag() now takes a cache-life profile such as 'max' for stale-while-revalidate.",
        problem:
          "One invalidation behavior does not fit every mutation: forms often need the writer to see fresh data immediately, while published content can serve stale data as it revalidates.",
        before: String.raw`'use server';
import { revalidateTag } from "next/cache";

export async function saveProfile() {
  await updateProfile();
  revalidateTag("profile"); // old one-argument form
}`,
        after: String.raw`'use server';
import { refresh, updateTag } from "next/cache";

export async function saveProfile() {
  await updateProfile();
  updateTag("profile"); // read-your-writes for tagged data
  refresh();            // refresh uncached data in the UI
}

// For stale-while-revalidate, use:
// revalidateTag("articles", "max")`,
        useWhen:
          "Use updateTag after a Server Action when the user must immediately see their write; refresh for uncached data; revalidateTag(tag, 'max') for content that can be refreshed in the background.",
        avoidWhen:
          "You are in a Client Component or Proxy. updateTag and refresh are Server Action-only; revalidateTag is for server environments and should be given an explicit profile.",
        docs: [
          {
            label: "Next.js: updateTag",
            url: "https://nextjs.org/docs/app/api-reference/functions/updateTag",
          },
          {
            label: "Next.js: refresh",
            url: "https://nextjs.org/docs/app/api-reference/functions/refresh",
          },
          {
            label: "Next.js: revalidateTag",
            url: "https://nextjs.org/docs/app/api-reference/functions/revalidateTag",
          },
        ],
      },
    ],
  },
  {
    id: "next-15-5",
    name: "Next.js 15.5",
    family: "Next.js",
    description:
      "Stable Node.js middleware plus generated route types for safer links and page props.",
    blog: "https://nextjs.org/blog/next-15-5",
    features: [
      {
        slug: "node-middleware",
        title: "Stable Node.js Middleware",
        short:
          "Use Node.js APIs and packages in Middleware without the earlier experimental runtime flag.",
        intro:
          "Next.js 15.5 makes the Node.js runtime for the middleware.ts convention stable. Middleware can use Node-specific dependencies where Edge Runtime constraints are a blocker.",
        problem:
          "The Edge Runtime is deliberately limited and cannot run every Node.js library or API needed by existing middleware integrations.",
        before: String.raw`// Middleware was limited to the Edge Runtime
// unless the Node.js option was experimental.`,
        after: String.raw`// middleware.ts (Next.js 15.5)
export const config = { runtime: "nodejs" };

export function middleware(request) {
  // Node.js-compatible middleware code
  return NextResponse.next();
}`,
        useWhen:
          "Middleware must use a Node.js-only package or API and the route-level interception is appropriate.",
        avoidWhen:
          "The logic can run in Edge, does expensive or slow work on every request, or belongs in a route handler or data layer. In Next.js 16, see the renamed proxy.ts convention.",
        docs: [
          {
            label: "Next.js 15.5: Node.js Middleware",
            url: "https://nextjs.org/blog/next-15-5#nodejs-middleware-stable",
          },
          {
            label: "Next.js 16: Proxy migration",
            url: "https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy",
          },
        ],
      },
      {
        slug: "typed-routes",
        title: "Typed Routes",
        short:
          "Generate route-aware types so invalid Link destinations fail at compile time.",
        intro:
          "The stable typedRoutes option generates route types from the app's file structure. TypeScript can then check Link href values against actual routes, including dynamic segments.",
        problem:
          "A misspelled or removed route in a Link is otherwise just a string and may only be noticed after a user follows it.",
        before: String.raw`<Link href="/dashbord">Dashboard</Link>

// A route typo is still a valid string.`,
        after: String.raw`// next.config.ts
const nextConfig = { typedRoutes: true };

// Link href is checked against generated routes.
<Link href="/dashboard">Dashboard</Link>;
// <Link href="/dashbord">Dashboard</Link> // type error`,
        useWhen:
          "The project uses TypeScript and you want route changes and Link destinations checked together.",
        avoidWhen:
          "The destination is an external URL or a route assembled dynamically in a way TypeScript cannot infer. Keep those cases explicit and validated.",
        docs: [
          {
            label: "Next.js: typedRoutes",
            url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes",
          },
          {
            label: "Next.js 15.5: typed routes",
            url: "https://nextjs.org/blog/next-15-5#typed-routes-stable",
          },
        ],
      },
      {
        slug: "route-props",
        title: "Route Props Helpers",
        short:
          "Use generated PageProps, LayoutProps, and RouteContext types without manual route interfaces.",
        intro:
          "Next.js generates globally available helpers from route files. PageProps and LayoutProps type params, searchParams, children, and parallel slots from a route literal; RouteContext types Route Handler params.",
        problem:
          "Manually maintained prop interfaces can drift from a route's dynamic segments or parallel route slots, and repeated imports add noise.",
        before: String.raw`type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
}`,
        after: String.raw`export default async function Page(
  props: PageProps<"/blog/[slug]">
) {
  const { slug } = await props.params;
  const query = await props.searchParams;
}`,
        useWhen:
          "You are typing App Router pages, layouts, or handlers after Next.js has generated route types.",
        avoidWhen:
          "Types have not yet been generated or your route is outside the App Router. Run next dev, next build, or next typegen before standalone type checking.",
        docs: [
          {
            label: "Next.js: PageProps helper",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper",
          },
          {
            label: "Next.js: LayoutProps helper",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/layout#layout-props-helper",
          },
          {
            label: "Next.js: RouteContext helper",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/route#route-context-helper",
          },
        ],
      },
    ],
  },
  {
    id: "next-15-4",
    name: "Next.js 15.4",
    family: "Next.js",
    description:
      "The release post focuses on Turbopack build compatibility, stability, and performance.",
    blog: "https://nextjs.org/blog/next-15-4",
    emptyNote:
      "No new app-facing functionality met this guide's filter in the 15.4 announcement. Its headline changes are build and stability improvements, so they are intentionally not presented as feature demos.",
    features: [],
  },
  {
    id: "next-15-3",
    name: "Next.js 15.3",
    family: "Next.js",
    description:
      "Control in-app navigation, show local pending feedback, and initialize client instrumentation before hydration.",
    blog: "https://nextjs.org/blog/next-15-3",
    features: [
      {
        slug: "on-navigate",
        title: "onNavigate",
        short:
          "Run logic only for same-origin client navigation, and cancel it when needed.",
        intro:
          "The Link onNavigate callback fires when Next.js is about to perform a client-side navigation. Unlike onClick, it does not run for modified clicks, external links, or downloads; preventDefault() can block the transition.",
        problem:
          "A click handler sees clicks that are not app navigations, while an unsaved-changes guard should only intercept the client-side route transition it can actually cancel.",
        before: String.raw`<Link
  href="/settings"
  onClick={(event) => {
    // Also runs for clicks that open a new tab.
    trackClick(event);
  }}
>
  Settings
</Link>`,
        after: String.raw`<Link
  href="/settings"
  onNavigate={(event) => {
    if (hasUnsavedChanges) {
      event.preventDefault();
      openLeaveDialog();
    }
  }}
>
  Settings
</Link>`,
        useWhen:
          "A client-side navigation needs a guard, transition setup, or analytics event that should not run for external or modified clicks.",
        avoidWhen:
          "You need to handle every pointer/keyboard click or a traditional document navigation. Use onClick for general click behavior.",
        docs: [
          {
            label: "Next.js: Link onNavigate",
            url: "https://nextjs.org/docs/app/api-reference/components/link#onnavigate",
          },
          {
            label: "Next.js 15.3: Navigation hooks",
            url: "https://nextjs.org/blog/next-15-3#navigation-hooks",
          },
        ],
        demo: "on-navigate",
      },
      {
        slug: "use-link-status",
        title: "useLinkStatus",
        short:
          "Expose a Link's pending state for a small, local navigation indicator.",
        intro:
          "useLinkStatus() returns pending for a descendant of a Link while its navigation is in progress. It lets an individual link show immediate feedback when navigation cannot be completed from a prefetch.",
        problem:
          "A route-level loading screen can be too coarse, while a user clicking one slow link benefits from feedback right beside that link.",
        before: String.raw`<Link href="/reports" prefetch={false}>
  Reports
</Link>

// There is no link-local pending feedback.`,
        after: String.raw`function PendingHint() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className={pending ? "pending" : ""} />;
}

<Link href="/reports" prefetch={false}>
  Reports <PendingHint />
</Link>`,
        useWhen:
          "Prefetching is disabled or not ready and a specific link needs subtle, fixed-size pending feedback.",
        avoidWhen:
          "The destination is already prefetched or has a loading.js fallback. Avoid layout shifts; a route-level fallback is usually better than adding indicators everywhere.",
        docs: [
          {
            label: "Next.js: useLinkStatus",
            url: "https://nextjs.org/docs/app/api-reference/functions/use-link-status",
          },
          {
            label: "Next.js 15.3: Navigation hooks",
            url: "https://nextjs.org/blog/next-15-3#navigation-hooks",
          },
        ],
        demo: "link-status",
      },
      {
        slug: "instrumentation-client",
        title: "Client Instrumentation",
        short:
          "Run analytics, monitoring, and polyfill setup before React hydration begins.",
        intro:
          "A root instrumentation-client.ts file runs after the document is loaded but before React hydration. Its top-level synchronous code is available before the app becomes interactive.",
        problem:
          "A component Effect runs only after hydration, so it can miss early errors or startup events and is repeated as part of the component lifecycle.",
        before: String.raw`useEffect(() => {
  analytics.initialize();
  window.addEventListener("error", reportError);
}, []);

// Runs after the component mounts.`,
        after: String.raw`// instrumentation-client.ts at project root
analytics.initialize();
window.addEventListener("error", (event) => {
  reportError(event.error);
});

export function onRouterTransitionStart(url, type) {
  analytics.track("navigation", { url, type });
}`,
        useWhen:
          "Analytics, error monitoring, or a required client polyfill must be initialized before React hydration.",
        avoidWhen:
          "The code belongs to a component lifecycle or requires awaited asynchronous setup. Only synchronous top-level execution is guaranteed before hydration.",
        docs: [
          {
            label: "Next.js: instrumentation-client.js",
            url: "https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client",
          },
          {
            label: "Next.js 15.3: Client Instrumentation",
            url: "https://nextjs.org/blog/next-15-3#client-instrumentation-hook",
          },
        ],
      },
    ],
  },
];

export function getRelease(id: string) {
  return releases.find((release) => release.id === id);
}

export function getFeature(releaseId: string, slug: string) {
  const release = getRelease(releaseId);
  const feature = release?.features.find((entry) => entry.slug === slug);

  return release && feature ? { release, feature } : undefined;
}
