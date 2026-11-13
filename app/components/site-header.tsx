import Link from "next/link";

export const pageShellClass =
  "mx-auto w-[calc(100%_-_64px)] max-w-280 max-[720px]:w-[calc(100%_-_36px)] max-[720px]:max-w-140";

export const eyebrowClass =
  "m-0 text-muted font-mono text-[10px] font-semibold tracking-[0.12em] uppercase leading-[1.5]";

const wordmarkClass =
  "inline-flex items-center gap-2.75 text-xs font-bold tracking-[0.035em] max-[720px]:gap-2 max-[720px]:text-[10px]";

const wordmarkMarkClass =
  "grid size-7.5 place-items-center rounded-full bg-ink font-serif text-[19px] font-normal text-acid";

const mastheadLinkClass =
  "inline-flex items-center gap-2.75 text-[12px] font-medium text-muted max-[720px]:text-[10px]";

export function SiteHeader({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const linkContent = (
    <>
      {label}{" "}
      <span className="text-coral" aria-hidden="true">
        ↗
      </span>
    </>
  );

  return (
    <header className="flex min-h-19 items-center justify-between border-b border-line max-[720px]:min-h-16.5">
      <Link className={wordmarkClass} href="/">
        <span className={wordmarkMarkClass}>R</span>
        <span>Release notes</span>
      </Link>
      {external ? (
        <a
          className={mastheadLinkClass}
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {linkContent}
        </a>
      ) : (
        <Link className={mastheadLinkClass} href={href}>
          {linkContent}
        </Link>
      )}
    </header>
  );
}
