import Image from "next/image";
import { notFound } from "next/navigation";
import { TEAM } from "../team-data";
import Link from 'next/link'
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  // Optional: prebuild pages for these slugs (works for static export/SSG)
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return { title: "Team Member Not Found" };
  return {
    title: `${member.name} — Core Team`,
    description: `${member.name}, ${member.role} at Reveiller Studios`,
  };
}

export default async function TeamMemberPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return notFound();

  return (
    <main className="p-8">
      <Link href="/about"
        className="text-sm underline underline-offset-2"
        >
        ← Back
      </Link>
    <article className="p-8 max-w-3xl mx-auto space-y-6">

      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{member.name}</h1>
        <p className="text-neutral-500">{member.role}</p>
      </header>

      <Image
        src={member.image}
        alt={`${member.name} portrait`}
        width={800}
        height={800}
        className="rounded-2xl object-cover"
        priority
        />

      <p className="leading-7">{member.bio}</p>

      {member.socials?.length ? (
          <ul className="flex gap-4">
          {member.socials.map((s) => (
              <li key={s.label}>
              <a className="underline" href={s.url} target="_blank">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
    </main>
  );
}
