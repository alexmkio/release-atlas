import Link from "next/link";
import {
  eyebrowClass,
  pageShellClass,
  SiteHeader,
} from "./components/site-header";
import { releases } from "./lib/releases";

export default function Home() {
  const reactReleases = releases.filter(
    (release) => release.family === "React",
  );
  const nextReleases = releases.filter(
    (release) => release.family === "Next.js",
  );

  return (
    <main className={pageShellClass}>
      <SiteHeader
        href="https://react.dev/blog"
        label="Official release posts"
        external
      />

      <section className="pt-20.5 pb-11.5 max-[720px]:pt-15.25">
        <p className={`${eyebrowClass} mb-3.25`}>
          A developer field guide · 2025—2026
        </p>
        <h1 className="m-0 font-serif text-[clamp(52px,8.2vw,101px)] font-normal leading-[0.98] tracking-[-0.07em]">
          The new stuff,
          <br />
          <span className="text-[#858779] italic">without the noise.</span>
        </h1>
        <div className="mt-9.25 flex items-end justify-between gap-7.5 max-[720px]:items-start max-[720px]:flex-col max-[720px]:gap-4.25">
          <p className="m-0 max-w-121.25 text-[17px] leading-[1.65] text-[#55594f]">
            A hands-on table of contents for the useful changes in React 19.2
            and 19.3, and Next.js 15.3 through 16.4.
          </p>
          <div className="flex shrink-0 items-baseline gap-2.25 whitespace-nowrap">
            <strong className="font-serif text-[36px] font-normal tracking-[-0.06em] max-[720px]:text-[29px]">
              {releases.reduce(
                (count, item) => count + item.features.length,
                0,
              )}
            </strong>
            <span className="font-mono text-[10px] tracking-[0.03em] text-muted">
              feature guides
            </span>
          </div>
        </div>
        <div
          className="mt-10.5 flex flex-wrap items-center gap-2.25 border-t border-line pt-4.5 font-mono text-[10px] text-muted"
          aria-hidden="true"
        >
          <span>Read the release</span>
          <span className="text-coral">·</span>
          <span>Understand the problem</span>
          <span className="text-coral">·</span>
          <span>Try the pattern</span>
        </div>
      </section>

      <section className="pt-8.5" aria-labelledby="toc-title">
        <div className="mb-6.5 flex items-end justify-between gap-6 max-[720px]:items-start max-[720px]:flex-col max-[720px]:gap-3">
          <div>
            <p className={`${eyebrowClass} mb-3.25`}>Contents</p>
            <h2
              className="m-0 font-serif text-[clamp(28px,4vw,39px)] font-normal leading-[1.1] tracking-[-0.045em]"
              id="toc-title"
            >
              Choose a release
            </h2>
          </div>
          <p className="m-0 mb-0.5 max-w-88.75 text-[13px] text-muted">
            Every version is a landing page. Open a feature for the before,
            after, trade-offs, and official docs.
          </p>
        </div>

        <div className="grid grid-cols-[195px_1fr] gap-6.25 border-t border-line pt-8 pb-9.5 max-[720px]:grid-cols-1 max-[720px]:gap-4 max-[720px]:pt-6">
          <div className="sticky top-5 grid grid-cols-[27px_1fr] items-baseline gap-x-2 self-start max-[720px]:static max-[720px]:w-max">
            <span className="font-mono text-[10px] text-coral">01</span>
            <h3 className="m-0 font-serif text-[23px] font-normal tracking-[-0.04em]">
              React
            </h3>
            <span className="col-start-2 mt-0.5 font-mono text-[10px] text-muted">
              19.2 — 19.3
            </span>
          </div>
          <div className="border-t border-line">
            {reactReleases.map((release, index) => (
              <ReleaseRow
                key={release.id}
                release={release}
                index={index + 1}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[195px_1fr] gap-6.25 border-t border-line pt-8 pb-9.5 max-[720px]:grid-cols-1 max-[720px]:gap-4 max-[720px]:pt-6">
          <div className="sticky top-5 grid grid-cols-[27px_1fr] items-baseline gap-x-2 self-start max-[720px]:static max-[720px]:w-max">
            <span className="font-mono text-[10px] text-coral">02</span>
            <h3 className="m-0 font-serif text-[23px] font-normal tracking-[-0.04em]">
              Next.js
            </h3>
            <span className="col-start-2 mt-0.5 font-mono text-[10px] text-muted">
              15.3 — 16.4
            </span>
          </div>
          <div className="border-t border-line">
            {nextReleases.map((release, index) => (
              <ReleaseRow
                key={release.id}
                release={release}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ReleaseRow({
  release,
  index,
}: {
  release: (typeof releases)[number];
  index: number;
}) {
  return (
    <article className="border-b border-line py-5.25 pb-5.5">
      <div className="flex items-baseline gap-2.75 max-[720px]:flex-wrap">
        <span className="font-mono text-[10px] text-coral">
          {String(index).padStart(2, "0")}
        </span>
        <Link
          className="font-serif text-[24px] tracking-[-0.04em] transition-colors hover:text-olive max-[720px]:text-[22px]"
          href={`/${release.id}/`}
        >
          {release.name}
          <span className="font-sans text-[13px] text-coral" aria-hidden="true">
            {" "}
            ↗
          </span>
        </Link>
        <span className="ml-auto font-mono text-[10px] tracking-[0.03em] text-muted">
          {release.features.length
            ? `${release.features.length} guides`
            : "No qualifying features"}
        </span>
      </div>
      <p className="mt-1.25 mb-0 ml-9 text-[12px] text-muted max-[720px]:ml-0">
        {release.description}
      </p>
      {release.features.length > 0 ? (
        <ul className="mt-3.5 mb-0 ml-9 flex flex-wrap gap-x-2.25 gap-y-1.75 p-0 list-none max-[720px]:ml-0 max-[720px]:gap-1.5">
          {release.features.map((feature) => (
            <li className="flex" key={feature.slug}>
              <Link
                className="inline-flex min-h-7.75 items-center gap-3.5 rounded-xs border border-line bg-paper-bright/60 px-2.25 py-1.25 text-[11px] text-[#4c5046] transition-colors hover:border-[#9baa70] hover:bg-paper-bright hover:text-olive max-[720px]:gap-2 max-[720px]:text-[10px]"
                href={`/${release.id}/${feature.slug}/`}
              >
                <span>{feature.title}</span>
                <span className="text-[10px] text-coral" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3.5 mb-0 ml-9 text-[12px] italic text-muted max-[720px]:ml-0">
          The release post focused on performance or tooling, rather than a new
          app-facing API.
        </p>
      )}
    </article>
  );
}
