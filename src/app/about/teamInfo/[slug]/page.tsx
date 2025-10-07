import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TEAM } from "../../teamInfo/team-data";
import About from "@/components/About/About";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const {slug} = await params;
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return { title: "Team Member Not Found" };
  return {
    title: `${member.name} — Core Team`,
    description: `${member.name}, ${member.role} at Reveiller Studios`,
  };
}




export default async function TeamMemberPage({ params }: PageProps) {
 
  const { slug } = await params;              // ✅ await
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return notFound();      

  // ✅ pass the resolved member down
  return <About member={member} />;
}
