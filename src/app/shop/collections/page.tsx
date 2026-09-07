import { redirect } from 'next/navigation';
import Waitlist from '@/components/Waitlist/Waitlist';
import { isShopOpen } from '@/utils/shopStatus/shopStatus';

// There's no index of collections to show while the store is paused --
// only /shop/collections/[slug] exists, so hitting /shop/collections
// directly (e.g. from a nav link with no slug) had no matching page and
// fell through to the default Next.js 404 instead of the waitlist state
// the rest of the shop shows. Once the shop reopens there's still no
// "browse all collections" page built, so send visitors to /shop instead.
export default function Page() {
  if (isShopOpen) {
    redirect('/shop');
  }

  return <Waitlist />;
}
