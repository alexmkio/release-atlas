"use client";

import Link, { useLinkStatus } from "next/link";
import {
  Activity,
  Fragment,
  Suspense,
  ViewTransition,
  addTransitionType,
  startTransition,
  use,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition,
  type FragmentInstance,
} from "react";
import { browser } from "react-dom";
import type { DemoId } from "../lib/releases";

const styles = {
  stack: "grid justify-items-start gap-3.75",
  label: "m-0 font-mono text-[10px] text-muted",
  footnote: "m-0 max-w-160 text-[11px] text-muted",
  controls: "flex flex-wrap items-center gap-2.5",
  button:
    "inline-flex min-h-9.5 cursor-pointer items-center justify-center gap-2.5 rounded-xs border px-3.25 py-2 text-[11px] font-bold transition-colors",
  darkButton: "border-transparent bg-ink text-white hover:bg-[#454a3e]",
  lightButton: "border-line bg-white text-ink hover:border-[#9baa70]",
  status: "font-mono text-[10px] text-muted",
  loading: "m-0 text-[13px] text-coral",
  result: "m-0 font-serif text-[20px] text-[#596a2b]",
  miniLabel: "block font-mono text-[9px] tracking-[0.03em] text-muted",
  activityStage: "min-h-22.5 w-full",
  activityPanel:
    "flex w-full max-w-130 items-center gap-3.5 border border-line bg-[#f3f4ea] p-3.25",
  profileTile:
    "flex w-full max-w-97.5 items-center gap-3 border border-line bg-[#f2f4e8] p-3.5",
  avatar:
    "grid size-10.5 shrink-0 place-items-center rounded-full bg-acid font-serif text-[20px]",
  transitionStage: "min-h-24 w-full",
  slideCard:
    "min-h-27.5 w-full max-w-121.25 border border-line bg-[#f3f4ea] p-4.25",
  fragmentStatus: "flex items-center gap-2 text-[11px] text-muted",
  statusDot: "inline-block size-1.75 rounded-full",
  observerWindow:
    "grid h-35 w-full max-w-105 gap-45 overflow-auto border border-line bg-[#f3f4ea] p-2.5",
  observerCard:
    "flex min-h-18 items-center gap-3 border border-line bg-paper-bright p-3",
  demoToggle: "inline-flex items-center gap-2 text-[12px]",
  demoLinkRow:
    "flex min-h-11.25 w-full max-w-115 items-center justify-between gap-6.25 border border-line bg-white px-3 py-2.5 text-[12px] hover:border-[#9baa70]",
  linkPending: "size-2 shrink-0 rounded-full bg-[#d3d5ca]",
  linkPendingActive:
    "bg-coral animate-[pending-pulse_650ms_ease-in-out_infinite_alternate]",
};

export function FeatureDemo({ featureId }: { featureId: DemoId }) {
  switch (featureId) {
    case "async-primitives":
      return <AsyncPrimitivesDemo />;
    case "activity":
      return <ActivityDemo />;
    case "effect-event":
      return <EffectEventDemo />;
    case "view-transition":
      return <ViewTransitionDemo />;
    case "transition-types":
      return <TransitionTypesDemo />;
    case "fragment-refs":
      return <FragmentRefsDemo />;
    case "browser":
      return <BrowserDemo />;
    case "on-navigate":
      return <OnNavigateDemo />;
    case "link-status":
      return <LinkStatusDemo />;
    case "link-transition-types":
      return <LinkTransitionTypesDemo />;
  }
}

function AsyncPrimitivesDemo() {
  const [promise, setPromise] = useState<Promise<string>>(() => makeGreeting());
  const [isPending, startTransitionUpdate] = useTransition();

  return (
    <div className={styles.stack}>
      <p className={styles.label}>Promise reading + Suspense + a transition</p>
      <div className={styles.controls}>
        <button
          className={`${styles.button} ${styles.darkButton}`}
          onClick={() =>
            startTransitionUpdate(() => setPromise(makeGreeting()))
          }
        >
          Load another greeting
        </button>
        <span className={styles.status}>
          {isPending ? "Transition pending…" : "Ready"}
        </span>
      </div>
      <Suspense
        fallback={<p className={styles.loading}>Loading inside Suspense…</p>}
      >
        <Greeting promise={promise} />
      </Suspense>
      <p className={styles.footnote}>
        On the first render, the boundary shows its fallback. A transition to
        another promise can keep the current content on screen.
      </p>
    </div>
  );
}

function Greeting({ promise }: { promise: Promise<string> }) {
  return <p className={styles.result}>{use(promise)}</p>;
}

function makeGreeting() {
  return new Promise<string>((resolve) => {
    setTimeout(
      () =>
        resolve("The promise resolved. Suspense handled the pending state."),
      850,
    );
  });
}

function ActivityDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div className={styles.stack}>
      <p className={styles.label}>Hide and restore a stateful screen</p>
      <button
        className={`${styles.button} ${styles.darkButton}`}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? "Hide panel" : "Show panel"}
      </button>
      <div className={styles.activityStage}>
        <Activity mode={visible ? "visible" : "hidden"}>
          <ActivityCounter />
        </Activity>
        {!visible && (
          <p className={styles.footnote}>
            The panel is hidden; its count is retained.
          </p>
        )}
      </div>
    </div>
  );
}

function ActivityCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.activityPanel}>
      <span className={styles.miniLabel}>Saved panel state</span>
      <strong className="font-serif text-[21px] font-normal">{count}</strong>
      <button
        className={`${styles.button} ${styles.lightButton}`}
        onClick={() => setCount((value) => value + 1)}
      >
        Increment
      </button>
    </div>
  );
}

function EffectEventDemo() {
  const [count, setCount] = useState(0);
  const [lastRead, setLastRead] = useState(0);
  const readLatestCount = useEffectEvent(() => setLastRead(count));

  useEffect(() => {
    const timer = window.setInterval(() => readLatestCount(), 900);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.stack}>
      <p className={styles.label}>
        A long-lived Effect callback reads the latest state
      </p>
      <div className="flex flex-wrap gap-7">
        <div>
          <span className={styles.miniLabel}>Current count</span>
          <strong className="mt-0.75 block font-serif text-[28px] font-normal">
            {count}
          </strong>
        </div>
        <div>
          <span className={styles.miniLabel}>Last Effect Event read</span>
          <strong className="mt-0.75 block font-serif text-[28px] font-normal">
            {lastRead}
          </strong>
        </div>
      </div>
      <button
        className={`${styles.button} ${styles.darkButton}`}
        onClick={() => setCount((value) => value + 1)}
      >
        Change count
      </button>
      <p className={styles.footnote}>
        The interval stays mounted while the Effect Event sees the newest count.
      </p>
    </div>
  );
}

function ViewTransitionDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.stack}>
      <p className={styles.label}>
        Add and remove UI inside a React Transition
      </p>
      <button
        className={`${styles.button} ${styles.darkButton}`}
        onClick={() => startTransition(() => setVisible((value) => !value))}
      >
        {visible ? "Remove profile" : "Reveal profile"}
      </button>
      <div className={styles.transitionStage}>
        {visible && (
          <ViewTransition>
            <div className={styles.profileTile}>
              <span className={styles.avatar}>A</span>
              <span>
                <strong className="block text-[12px]">Alex Rivera</strong>
                <small className="mt-0.75 block text-[10px] text-muted">
                  Product designer · online
                </small>
              </span>
            </div>
          </ViewTransition>
        )}
      </div>
      <p className={styles.footnote}>
        View Transitions run for updates marked as React Transitions, including
        this button&apos;s state change.
      </p>
    </div>
  );
}

function TransitionTypesDemo() {
  const slides = [
    { title: "Design systems", note: "A consistent set of reusable patterns." },
    {
      title: "Product stories",
      note: "Content that moves with a clear direction.",
    },
    { title: "Team workflows", note: "Interfaces that make progress visible." },
  ];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"initial" | "next" | "previous">(
    "initial",
  );

  function move(direction: 1 | -1) {
    startTransition(() => {
      const type = direction === 1 ? "next" : "previous";
      addTransitionType(type);
      setDirection(type);
      setIndex(
        (current) => (current + direction + slides.length) % slides.length,
      );
    });
  }

  return (
    <div className={styles.stack}>
      <p className={styles.label}>
        Direction labels select enter and exit animations
      </p>
      <div className={styles.controls}>
        <button
          className={`${styles.button} ${styles.lightButton}`}
          onClick={() => move(-1)}
          aria-label="Previous slide"
        >
          ←
        </button>
        <span className={styles.status}>
          {String(index + 1).padStart(2, "0")} / 03
        </span>
        <button
          className={`${styles.button} ${styles.lightButton}`}
          onClick={() => move(1)}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
      <ViewTransition
        key={index}
        default="none"
        enter={{ default: "none", next: "from-right", previous: "from-left" }}
        exit={{ default: "none", next: "to-left", previous: "to-right" }}
      >
        <div className={styles.slideCard}>
          <span className={styles.miniLabel}>Transition type: {direction}</span>
          <h3 className="mt-2.25 mb-0.75 font-serif text-[21px] font-normal">
            {slides[index].title}
          </h3>
          <p className="m-0 text-[11px] text-muted">{slides[index].note}</p>
        </div>
      </ViewTransition>
    </div>
  );
}

type FragmentObserverInstance = FragmentInstance & {
  observeUsing(observer: IntersectionObserver): void;
  unobserveUsing(observer: IntersectionObserver): void;
};

function FragmentRefsDemo() {
  const scrollRoot = useRef<HTMLDivElement>(null);
  const fragmentRef = useRef<FragmentInstance | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const root = scrollRoot.current;
    if (!root) return;

    const visibleElements = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleElements.add(entry.target);
          else visibleElements.delete(entry.target);
        });
        setInView(visibleElements.size > 0);
      },
      { root, threshold: 0.1 },
    );
    // React 19.3 provides these methods at runtime; the installed React typings
    // currently leave FragmentInstance empty.
    const fragment = fragmentRef.current as FragmentObserverInstance | null;
    fragment?.observeUsing(observer);

    return () => {
      fragment?.unobserveUsing(observer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.stack}>
      <p className={styles.label}>
        Scroll through the gap to see sibling visibility change
      </p>
      <div className={styles.fragmentStatus}>
        <span
          className={`${styles.statusDot} ${
            inView ? "bg-[#88a934] shadow-[0_0_0_3px_#e6edce]" : "bg-[#b8bdab]"
          }`}
        />
        {inView ? "At least one card is in view" : "No cards in view"}
      </div>
      <div
        aria-label="Scroll area with observed sibling cards"
        className={styles.observerWindow}
        ref={scrollRoot}
        tabIndex={0}
      >
        <Fragment ref={fragmentRef}>
          <div className={styles.observerCard}>
            <span className="font-mono text-[9px] text-coral">01</span>
            <strong className="font-serif text-[15px] font-normal">
              First sibling
            </strong>
          </div>
          <div className={styles.observerCard}>
            <span className="font-mono text-[9px] text-coral">02</span>
            <strong className="font-serif text-[15px] font-normal">
              Second sibling
            </strong>
          </div>
        </Fragment>
      </div>
      <p className={styles.footnote}>
        The Fragment adds no element to the DOM. Its FragmentInstance observes
        the child cards together; focus the scroll area and use the arrow keys
        to move through it.
      </p>
    </div>
  );
}

function BrowserDemo() {
  return (
    <div className={styles.stack}>
      <p className={styles.label}>
        The server renders a fallback; the browser reads its local time zone
      </p>
      <Suspense
        fallback={<p className={styles.loading}>Waiting for the browser…</p>}
      >
        <LocalTimeZone />
      </Suspense>
      <p className={styles.footnote}>
        Reload to see the server-side fallback before the Client Component
        hydrates.
      </p>
    </div>
  );
}

function LocalTimeZone() {
  use(browser("The local time zone is only available in the browser."));
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p className={styles.result}>{timeZone}</p>;
}

function OnNavigateDemo() {
  const [hasChanges, setHasChanges] = useState(true);
  const [message, setMessage] = useState(
    "Unsaved changes are on. Try the link.",
  );

  return (
    <div className={styles.stack}>
      <p className={styles.label}>
        Prevent an in-app route change when a draft is dirty
      </p>
      <label className={styles.demoToggle}>
        <input
          className="accent-[#657f25]"
          checked={hasChanges}
          onChange={(event) => {
            setHasChanges(event.target.checked);
            setMessage(
              event.target.checked
                ? "Unsaved changes are on."
                : "Draft is saved.",
            );
          }}
          type="checkbox"
        />
        <span>There are unsaved changes</span>
      </label>
      <Link
        className={`${styles.button} ${styles.darkButton} w-fit`}
        href="/next-15-5/"
        onNavigate={(event) => {
          if (hasChanges) {
            event.preventDefault();
            setMessage("Navigation cancelled. Save the draft to continue.");
          }
        }}
      >
        Try navigating to Next.js 15.5 <span aria-hidden="true">→</span>
      </Link>
      <p
        className="m-0 font-serif text-[20px] text-[#596a2b]"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}

function LinkStatusDemo() {
  return (
    <div className={styles.stack}>
      <p className={styles.label}>A pending hint lives inside its Link</p>
      <Link className={styles.demoLinkRow} href="/next-15-5/" prefetch={false}>
        <span>Navigate to the Next.js 15.5 guide</span>
        <LinkPending />
      </Link>
      <p className={styles.footnote}>
        Prefetch is disabled so there is an opportunity to observe the pending
        state during the navigation.
      </p>
    </div>
  );
}

function LinkPending() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-label={pending ? "Navigation pending" : "Ready"}
      className={`${styles.linkPending} ${
        pending ? styles.linkPendingActive : ""
      }`}
    />
  );
}

function LinkTransitionTypesDemo() {
  return (
    <div className={styles.stack}>
      <p className={styles.label}>Add intent to an App Router link</p>
      <Link
        className={`${styles.button} ${styles.darkButton} w-fit`}
        href="/react-19-3/view-transitions/"
        transitionTypes={["slide"]}
      >
        Open the ViewTransition guide <span aria-hidden="true">→</span>
      </Link>
      <p className={styles.footnote}>
        The prop labels the navigation; an animation still needs a matching
        ViewTransition or CSS rule.
      </p>
    </div>
  );
}
