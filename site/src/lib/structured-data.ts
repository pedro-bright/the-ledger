import type { EventData, ThreadData } from './content';

// schema.org data written as JSON-LD in page heads.

const SITE = 'https://the-ledger.net';
const LICENSE = 'https://creativecommons.org/licenses/by-sa/4.0/';

const absolute = (href: string) => new URL(href, SITE).toString();

/** A BreadcrumbList with the same items as the visible breadcrumb; the current page has no link. */
export function breadcrumbList(crumbs: Array<{ label: string; href?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href && { item: absolute(crumb.href) }),
    })),
  };
}

/** An Article describing an event entry, citing each of its sources. */
export function eventArticle(event: EventData, description: string, threads: ThreadData[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: event.title,
    description,
    // The date the entry was added, when the record has one.
    datePublished: event.revision?.created ?? event.date,
    ...(event.revision?.last_reviewed && { dateModified: event.revision.last_reviewed }),
    temporalCoverage: event.date,
    citation: (event.sources ?? []).map((source) => ({
      '@type': 'CreativeWork',
      name: source.title,
      url: source.url,
      ...(source.publisher && { publisher: { '@type': 'Organization', name: source.publisher } }),
    })),
    isPartOf: threads.map((thread) => ({
      '@type': 'CreativeWork',
      name: thread.title,
      url: absolute(`/threads/${thread.slug}/`),
    })),
    publisher: { '@type': 'Organization', name: 'The Ledger', url: absolute('/') },
    license: LICENSE,
  };
}
