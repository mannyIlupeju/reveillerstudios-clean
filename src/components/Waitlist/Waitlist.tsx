import ShopWaitlistForm from './ShopWaitlistForm';

interface WaitlistProps {
  heading?: string;
  message?: string;
}

// "Shop closed, join the waitlist" state used wherever a Shopify-backed
// page has nothing to show because the store is paused (e.g.
// /shop/collections/[slug] when the collection fetch fails, or /shop
// itself). Delegates the heading/message + signup form to
// ShopWaitlistForm, which also carries the background image.
export default function Waitlist({ heading, message }: WaitlistProps) {
  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <ShopWaitlistForm heading={heading} message={message} />
    </main>
  );
}
