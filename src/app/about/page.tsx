import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import TeamInfo from "./teamInfo/page";

export const metadata: Metadata = {
  title: "About Reveiller Studios | Toronto Streetwear Brand",
  description:
    "Reveiller Studios is a Toronto streetwear label creating limited-run garments with quality fabrics and precise fits. Learn our story, values, and process.",
  alternates: { canonical: "https://www.reveillerstudios.com/about" },
  openGraph: {
    type: "website",
    url: "https://www.reveillerstudios.com/about",
    title: "About Reveiller Studios",
    description:
      "Toronto streetwear label crafting limited runs with quality fabrics.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Reveiller Studios" }],
    siteName: "Reveiller Studios",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Reveiller Studios",
    description: "Toronto streetwear label crafting limited runs.",
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Reveiller Studios",
    url: "https://www.reveillerstudios.com",
    logo: "https://www.reveillerstudios.com/og.png",
    foundingDate: "2023",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA"
    },
    sameAs: [
      "https://www.instagram.com/<your-handle>",
      "https://www.tiktok.com/@<your-handle>",
      "https://www.linkedin.com/company/<your-handle>"
    ]
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.reveillerstudios.com/" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://www.reveillerstudios.com/about" }
    ]
  };

  return (
    <main className="mx-auto px-6 space-y-10">
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Script
        id="breadcrumbs-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />

      <header className="my-8 flex justify-center">
        <h1 className="text-4xl font-semibold">About</h1>
      </header>

     <section className="flex md:flex-row flex-col gap-20">
      <div className=" p-8 text-zinc-700  font-serif leading-relaxed tracking-wide space-y-4">
        <h1 className="text-2xl font-bold uppercase">
          To the Ones Who Never Fit
        </h1>

        <div className="text-sm"> 
        <p>
          We stitch in silence, but scream in thread,<br />
          Tailoring dreams that the fashion gods dread.<br />
          Not for the polished, not for the preened<br />
          We ride where rebels convene.
        </p>
        <br></br>
        <p>
          Born of culture, bathed in fire,<br />
          Woven with rage, sewn with desire.<br />
          Fabrics that speak what mouths never could,<br />
          We pattern the pain of the misunderstood.
        </p>
        <br></br>
        <p>
        Quality not as luxury — but resistance,<br></br>
        In every stitch, a stand. In every hem, persistence.<br></br>
        Cotton, wool, linen — not just materials,
        But battle flags for the misfits, the ethereal.
        </p>
        <br></br>
       <p>
        Not couture for the catwalk of Parisian clout<br></br>
        But armor for those the system threw out.<br></br>
        We drape the doubted, the muted, the meek,
        And turn quiet defiance into avant mystique.
       </p>
       <p>
       <br></br>
        Call it fashion — we call it revolt.<br></br>
        In seams, in shapes, in every cult bolt.<br></br>
        We aren’t chasing hype or elite validation,<br></br>
        We’re bleeding heritage and fierce reclamation.
       </p>

        <br></br>

       <p>
        This is for the unchosen, the closet-bound voices,<br></br>
        For the ones denied choices,
        For the kids called weird <br></br>
        We thread your pain into silhouettes revered.
        </p>

      <br></br>
        <p>
        So wear your Reveiller with chin held high<br></br>
        You are art. You are the reason why
        We rebel with a bobbin, riot with a needle and 
        make “uncool” the new cathedral.
       </p>

       <p>
        From the margin to the mainstage,
        We don’t ask to belong;
        We cut our own page.
       </p>
       </div>
      </div>

      <TeamInfo/>
    </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-medium">The Story</h2>
        <p>
          Originally starting as an artbrand in 2016, born out of a need to represent a voice that did not exist in Fashion at the time<br></br> Reveillerstudios was a platform for young artists to find their creativity and build their skills early in their careers.<br></br> 
          From creating art wearables, creative directing and styling projects for other brands<br></br> The brand has fully matured into a full functioning fashion brand taking all of these experiences to create a new platform that showcases our creative identity.<br></br>
          On our third iteration, our goal is to be more direct and cut through the noise with creative projects that embodies our belief system and identity.
        </p>
      </section>

     
    


      <nav className="pt-6 border-t flex justify-end mt-8">
        <div className="flex flex-wrap gap-4">
          <Link href="/shop" className="underline">Shop the latest</Link>
          <Link href="/contact" className="underline">Contact</Link>
         
        </div>
      </nav>
    </main>
  );
}
