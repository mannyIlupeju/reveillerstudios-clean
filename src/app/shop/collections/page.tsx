import Waitlist from '@/components/Waitlist/Waitlist';

// There's no index of collections to show while the store is paused --
// only /shop/collections/[slug] exists, so hitting /shop/collections
// directly (e.g. from a nav link with no slug) had no matching page and
// fell through to the default Next.js 404 instead of the waitlist state
// the rest of the shop shows.
export default function Page() {
  return <Waitlist />;
}
