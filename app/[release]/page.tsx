import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  eyebrowClass,
  pageShellClass,
  SiteHeader,
} from "../components/site-header";
import { getRelease, releases } from "../lib/releases";

export function generateStaticParams() {
  return releases.map(({ id }) => ({ release: id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[release]">): Promise<Metadata> {
  const { release: releaseId } = await params;
  const release = getRelease(releaseId);

  return {
    title: release ? `${release.name} features` : "Release not found",
  };
}

export default function ReleasePage({ params }: PageProps<"/[release]">) {
  return (
    <Suspense fallback={<ReleasePageFallback />}>
      <ReleasePageContent params={params} />
    </Suspense>
  );
}

async function ReleasePageContent({
  params,
}: Pick<PageProps<"/[release]">, "params">) {
  const { release: releaseId } = await params;
  const release = getRelease(releaseId);

  if (!release) notFound();

  return (
    <main className={pageShellClass}>
      <SiteHeader href="/" label="All releases" />
      <div className="flex flex-wrap items-center gap-2.25 py-5.5 font-mono text-[10px] text-muted">
        <Link className="hover:text-ink" href="/">
          Contents
        </Link>
        <span className="text-coral" aria-hidden="true">
          /
        </span>
        <span>{release.name}</span>
      </div>

      <section className="pt-12 pb-9.25">
        <p className={`${eyebrowClass} mb-3.25`}>
          {release.family} · Release guide
        </p>
        <h1 className="m-0 font-serif text-[clamp(50px,7vw,78px)] font-normal leading-[0.98] tracking-[-0.07em]">
          {release.name}
        </h1>
        <p className="mt-5.5 mb-4.25 max-w-177.5 text-[clamp(16px,2.2vw,19px)] leading-[1.65] text-[#55594f]">
          {release.description}
        </p>
        <a
          className="inline-flex items-center gap-2 text-[12px] font-bold text-ink"
          href={release.blog}
          target="_blank"
          rel="noreferrer"
        >
          Read the official release post{" "}
          <span className="text-coral" aria-hidden="true">
            ↗
          </span>
        </a>
      </section>

      {release.note && (
        <aside className="mb-8.75 flex items-start gap-3.5 border border-[#d5d9c3] bg-[#e9ebdd] px-4.75 py-4.25 text-[#4c5042]">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] text-acid">
            !
          </span>
          <p className="m-0 text-[12px]">{release.note}</p>
        </aside>
      )}

      {release.features.length > 0 ? (
        <section className="pt-4.5 pb-17" aria-labelledby="feature-index-title">
          <div className="mb-4.5 flex items-end justify-between gap-6 max-[720px]:items-start max-[720px]:flex-col max-[720px]:gap-3">
            <div>
              <p className={`${eyebrowClass} mb-1.75`}>In this release</p>
              <h2
                className="m-0 font-serif text-[clamp(27px,4vw,34px)] font-normal leading-[1.1] tracking-[-0.045em]"
                id="feature-index-title"
              >
                Feature index
              </h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.03em] text-muted">
              {release.features.length} guides
            </span>
          </div>
          <div className="border-t border-line">
            {release.features.map((feature, index) => (
              <Link
                className="group grid min-h-19 grid-cols-[34px_1fr_24px] items-center gap-2.5 border-b border-line px-1 py-3"
                href={`/${release.id}/${feature.slug}/`}
                key={feature.slug}
              >
                <span className="font-mono text-[10px] text-coral">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid gap-0.75">
                  <strong className="font-serif text-[20px] font-normal tracking-tight transition-colors group-hover:text-olive">
                    {feature.title}
                  </strong>
                  <span className="text-[12px] text-muted">
                    {feature.short}
                  </span>
                </span>
                <span className="text-right text-coral" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <aside className="mb-18.75 mt-4 flex gap-5.75 border border-line bg-paper-bright p-7 max-[720px]:p-5">
          <span className="font-mono text-[22px] text-coral" aria-hidden="true">
            —
          </span>
          <div>
            <h2 className="mt-0 mb-1.75 font-serif text-[24px] font-normal">
              No feature demos in this guide
            </h2>
            <p className="mb-3.25 mt-0 max-w-160 text-[13px] text-muted">
              {release.emptyNote}
            </p>
            <a
              className="text-[11px] font-bold text-ink"
              href={release.blog}
              target="_blank"
              rel="noreferrer"
            >
              Check the full release notes{" "}
              <span className="text-coral" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </aside>
      )}
    </main>
  );
}

function ReleasePageFallback() {
  return (
    <main className={pageShellClass} aria-busy="true">
      <p className="sr-only" role="status">
        Loading release guide
      </p>
      <SiteHeader href="/" label="All releases" />
      <div className="py-5.5" aria-hidden="true">
        <div className="h-2.5 w-32 animate-pulse rounded bg-line" />
      </div>
      <section className="pt-12 pb-9.25" aria-hidden="true">
        <div className="h-2.5 w-36 animate-pulse rounded bg-line" />
        <div className="mt-4 h-14 w-2/3 animate-pulse rounded bg-line" />
        <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-line" />
      </section>
      <div className="space-y-5 border-t border-line pb-17" aria-hidden="true">
        <div className="h-19 animate-pulse border-b border-line" />
        <div className="h-19 animate-pulse border-b border-line" />
        <div className="h-19 animate-pulse border-b border-line" />
      </div>
    </main>
  );
}
