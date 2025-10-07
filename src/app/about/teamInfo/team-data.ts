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
    role: "Styling, Creative Direction & Operations",
    bio: "Leads design direction and garment development across collections.",
    image: "/images/mabel-ascii-art.png",
    socials: [{ label: "Instagram", url: "https://instagram.com/…" }],
  },
  {
    slug: "tony-igelenyah",
    name: "Tony Igelenyah",
    role: "Manufacturing & Operations",
    bio: "Runs production ops, supplier relations, and drop logistics.",
    image: "/images/ttt-ascii-art.png",
  },
  {
    slug: "manny-ilupeju",
    name: "Manny Ilupeju",
    role: "Founder, Art & Design Director",
    bio: "Drives brand strategy, product, and partnerships.",
    image: "/images/manny-ascii-art.png",
  },
];
