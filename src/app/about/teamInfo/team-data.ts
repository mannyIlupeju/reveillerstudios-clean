export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string; // path under /public
  socials?: { label: string; url: string }[];
};

export const TEAM: TeamMember[] = [
  {
    slug: "mabel-conteh",
    name: "Mabel Conteh",
    role: "Creative & Brand Strategist",
    bio: "Drives brand strategy, product ideas, and partnerships.",
    image: "/images/mabel-ascii-art.png",
    socials: [{ label: "Instagram", url: "https://instagram.com/geeeegoli…" }],
  },
  {
    slug: "tony-igelenyah",
    name: "Tony Igelenyah",
    role: "Manufacturing & Operations",
    bio: "Runs production ops, supplier relations, and drop logistics.",
    image: "/images/ttt-ascii-art.png",
    socials: [{ label: "Instagram", url: "https://instagram.com/tonytonytons_" }],
  },
  {
    slug: "manny-ilupeju",
    name: "Manny Ilupeju",
    role: "Creative & Lead Design Director",
    bio: "Leads design direction and garment development across collections",
    image: "/images/manny-ascii-art.png",
    socials: [{ label: "Instagram", url: "https://instagram.com/mannybiz_" }],
  },
];
