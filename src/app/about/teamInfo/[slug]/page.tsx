import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TEAM } from "../../teamInfo/team-data";
import About from "@/components/About/About";

type PageProps = { params: Promise<{ slug: string }>};

// (Optional) helps with build-time typing
export function generateStaticParams(): { slug: string }[] {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ no await
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return { title: "Team Member Not Found" };
  return {
    title: `${member.name} — Core Team`,
    description: `${member.name}, ${member.role} at Reveiller Studios`,
  };
}

export default async function TeamMemberPage({ params }: PageProps) { // ✅ no async needed
  const { slug } = await params; // ✅ plain object
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return notFound();
  return <About member={member} />;
}