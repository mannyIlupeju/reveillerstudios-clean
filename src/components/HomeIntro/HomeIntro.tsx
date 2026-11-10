import Link from 'next/link';

// Plain, server-friendly HTML so crawlers (and anyone without JavaScript)
// get real content on the homepage, not just the 3D canvas.
export default function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-heading"
      className="w-full max-w-3xl mx-auto px-6 py-16 text-sm leading-relaxed"
    >
      <h1 id="home-intro-heading" className="text-xl font-medium mb-4">
        Reveiller Studios
      </h1>
      <p className="mb-4">
        Reveiller Studios is a streetwear label based in Canada. We release
        limited drops of hoodies, tees, tanks and accessories made with premium
        fabrics, and share each release through lookbooks and our community.
      </p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 underline underline-offset-4">
        <li><Link href="/shop/collections/all">Shop all</Link></li>
        <li><Link href="/shop/collections/tshirts">T-shirts</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/shipping">Shipping</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </section>
  );
}
