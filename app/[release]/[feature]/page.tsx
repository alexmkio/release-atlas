import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FeatureDemo } from "../../components/feature-demo";
import {
  eyebrowClass,
  pageShellClass,
  SiteHeader,
} from "../../components/site-header";
import { getFeature, releases } from "../../lib/releases";

export function generateStaticParams() {
  return releases.flatMap((release) =>
    release.features.map((feature) => ({
      release: release.id,
      feature: feature.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[release]/[feature]">): Promise<Metadata> {
  const { release, feature } = await params;
  const entry = getFeature(release, feature);

  return {
    title: entry
      ? `${entry.feature.title} · ${entry.release.name}`
      : "Feature not found",
  };
}

export default function FeaturePage({
  params,
}: PageProps<"/[release]/[feature]">) {
  return (
    <Suspense fallback={<FeaturePageFallback />}>
      <FeaturePageContent params={params} />
    </Suspense>
  );
}

async function FeaturePageContent({
  params,
}: Pick<PageProps<"/[release]/[feature]">, "params">) {
  const { release: releaseId, feature: featureSlug } = await params;
  const entry = getFeature(releaseId, featureSlug);

  if (!entry) notFound();

  const { release, feature } = entry;

  return (
    <main className={pageShellClass}>
      <SiteHeader href={release.blog} label="Release post" external />

      <nav
        className="flex flex-wrap items-center gap-2.25 py-5.5 font-mono text-[10px] text-muted"
        aria-label="Breadcrumb"
      >
        <Link className="hover:text-ink" href="/">
          Contents
        </Link>
        <span className="text-coral" aria-hidden="true">
          /
        </span>
        <Link className="hover:text-ink" href={`/${release.id}/`}>
          {release.name}
        </Link>
        <span className="text-coral" aria-hidden="true">
          /
        </span>
        <span>{feature.title}</span>
      </nav>

      <article>
        <header className="py-7.75">
          <p className={`${eyebrowClass} mb-3.25`}>
            {release.name} · Feature guide
          </p>
          <h1 className="m-0 max-w-225 wrap-break-word font-serif text-[clamp(43px,6.3vw,71px)] font-normal leading-[1.03] tracking-[-0.07em]">
            {feature.title}
          </h1>
          <p className="mt-4.25 mb-0 max-w-190 text-[clamp(16px,2.2vw,19px)] leading-[1.65] text-[#55594f]">
            {feature.short}
          </p>
          {feature.contextOnly && (
            <aside className="mt-5.5 mb-8.75 flex items-start gap-3.5 border border-[#d5d9c3] bg-[#e9ebdd] px-4.75 py-4.25 text-[#4c5042]">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] text-acid">
                i
              </span>
              <p className="m-0 text-[12px]">
                Included as useful context, not as a React 19.2 addition. The
                release-specific changes are listed separately.
              </p>
            </aside>
          )}
        </header>

        <section
          className="mb-14 mt-0.75 grid grid-cols-2 gap-3 max-[720px]:mb-10.75 max-[720px]:grid-cols-1"
          aria-label="Feature overview"
        >
          <div className="min-h-38.5 border border-line bg-paper-bright px-5.25 py-5 max-[720px]:min-h-0">
            <span className="font-mono text-[9px] font-semibold tracking-[0.09em] text-coral uppercase">
              01 / What it introduces
            </span>
            <p className="mt-4.25 mb-0 text-[13px] leading-[1.7] text-[#4f534a]">
              {feature.intro}
            </p>
          </div>
          <div className="min-h-38.5 border border-line bg-[#ebe9e0] px-5.25 py-5 max-[720px]:min-h-0">
            <span className="font-mono text-[9px] font-semibold tracking-[0.09em] text-coral uppercase">
              02 / The problem
            </span>
            <p className="mt-4.25 mb-0 text-[13px] leading-[1.7] text-[#4f534a]">
              {feature.problem}
            </p>
          </div>
        </section>

        <section className="mb-14.5" aria-labelledby="examples-title">
          <div className="mb-4.5 flex items-end justify-between gap-6 max-[720px]:items-start max-[720px]:flex-col max-[720px]:gap-3">
            <div>
              <p className={`${eyebrowClass} mb-1.75`}>The pattern</p>
              <h2
                className="m-0 font-serif text-[clamp(27px,4vw,34px)] font-normal leading-[1.1] tracking-[-0.045em]"
                id="examples-title"
              >
                Before / after
              </h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.03em] text-muted">
              A minimal sketch
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
            <CodeExample label="Before" code={feature.before} />
            <CodeExample label="After" code={feature.after} after />
          </div>
        </section>

        {feature.demo && (
          <section className="mb-14.5" aria-labelledby="demo-title">
            <div className="mb-4.5 flex items-end justify-between gap-6 max-[720px]:items-start max-[720px]:flex-col max-[720px]:gap-3">
              <div>
                <p className={`${eyebrowClass} mb-1.75`}>Try it</p>
                <h2
                  className="m-0 font-serif text-[clamp(27px,4vw,34px)] font-normal leading-[1.1] tracking-[-0.045em]"
                  id="demo-title"
                >
                  A small live demo
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.75 font-mono text-[9px] text-muted">
                <i className="size-1.75 rounded-full bg-[#94ad49]" />{" "}
                Interactive
              </span>
            </div>
            <div className="min-h-42.5 border border-line bg-paper-bright p-5.75 max-[720px]:p-4.25">
              <FeatureDemo featureId={feature.demo} />
            </div>
          </section>
        )}

        <section className="mb-14.5 pt-0.75" aria-labelledby="tradeoffs-title">
          <div className="mb-4.5 flex items-end justify-between gap-6 max-[720px]:items-start max-[720px]:flex-col max-[720px]:gap-3">
            <div>
              <p className={`${eyebrowClass} mb-1.75`}>A practical decision</p>
              <h2
                className="m-0 font-serif text-[clamp(27px,4vw,34px)] font-normal leading-[1.1] tracking-[-0.045em]"
                id="tradeoffs-title"
              >
                When to reach for it
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
            <div className="min-h-38.75 border border-line bg-paper-bright p-5">
              <span
                className="inline-grid size-5.5 place-items-center rounded-full bg-acid font-mono text-[13px]"
                aria-hidden="true"
              >
                +
              </span>
              <h3 className="mt-3 mb-1.5 text-[12px]">Use it when</h3>
              <p className="m-0 text-[12px] leading-[1.7] text-[#5b5e55]">
                {feature.useWhen}
              </p>
            </div>
            <div className="min-h-38.75 border border-line bg-[#ebe9e0] p-5">
              <span
                className="inline-grid size-5.5 place-items-center rounded-full bg-[#e8c1b6] font-mono text-[13px]"
                aria-hidden="true"
              >
                −
              </span>
              <h3 className="mt-3 mb-1.5 text-[12px]">Think twice when</h3>
              <p className="m-0 text-[12px] leading-[1.7] text-[#5b5e55]">
                {feature.avoidWhen}
              </p>
            </div>
          </div>
        </section>

        <section
          className="mb-14.5 border-t border-line pt-7 pb-9"
          aria-labelledby="docs-title"
        >
          <p className={`${eyebrowClass} mb-3.25`}>Go deeper</p>
          <h2
            className="mb-4.75 mt-0 font-serif text-[30px] font-normal leading-[1.1] tracking-[-0.045em]"
            id="docs-title"
          >
            Official documentation
          </h2>
          <ul className="m-0 flex flex-wrap gap-2 p-0 list-none">
            {feature.docs.map((doc) => (
              <li key={doc.url}>
                <a
                  className="inline-flex min-h-8.5 items-center gap-2.75 border border-line bg-paper-bright px-2.5 py-1.75 text-[10px] transition-colors hover:border-[#9baa70] hover:text-olive"
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {doc.label}{" "}
                  <span className="text-coral" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <footer className="flex min-h-17.5 items-center justify-between gap-4 border-t border-line font-mono text-[10px] text-muted [&_a:hover]:text-ink">
        <Link href={`/${release.id}/`}>← All {release.name} features</Link>
        <Link href="/">Release Atlas ↑</Link>
      </footer>
    </main>
  );
}

function FeaturePageFallback() {
  return (
    <main className={pageShellClass} aria-busy="true">
      <p className="sr-only" role="status">
        Loading feature guide
      </p>
      <SiteHeader href="/" label="All releases" />
      <div className="py-5.5" aria-hidden="true">
        <div className="h-2.5 w-48 animate-pulse rounded bg-line" />
      </div>
      <section className="py-7.75" aria-hidden="true">
        <div className="h-2.5 w-36 animate-pulse rounded bg-line" />
        <div className="mt-4 h-14 w-3/4 animate-pulse rounded bg-line" />
        <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-line" />
      </section>
      <div
        className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1"
        aria-hidden="true"
      >
        <div className="h-38.5 animate-pulse border border-line bg-paper-bright" />
        <div className="h-38.5 animate-pulse border border-line bg-paper-bright" />
      </div>
    </main>
  );
}

function CodeExample({
  label,
  code,
  after = false,
}: {
  label: string;
  code: string;
  after?: boolean;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded border ${
        after ? "border-[#71843a]" : "border-[#353a34]"
      } bg-[#232722] text-[#e6e9df]`}
    >
      <div className="flex h-9.75 items-center gap-2.5 border-b border-white/10 px-3.5">
        <span className="inline-flex gap-1" aria-hidden="true">
          <i
            className={`size-1.5 rounded-full ${after ? "bg-acid" : "bg-[#70766b]"}`}
          />
          <i className="size-1.5 rounded-full bg-[#70766b]" />
          <i className="size-1.5 rounded-full bg-[#70766b]" />
        </span>
        <span className="font-mono text-[10px] text-[#f2f1e9]">{label}</span>
        <span className="ml-auto font-mono text-[9px] text-[#9b9f91] uppercase">
          TSX
        </span>
      </div>
      <pre className="m-0 min-h-42.5 overflow-auto px-4.5 pt-4.25 pb-5 font-mono text-[11px] leading-[1.75] text-[#d9ddcf] [tab-size:2] max-[720px]:min-h-0 max-[720px]:text-[10px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
