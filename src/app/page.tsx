// app/page.tsx (Server Component)
import { type Metadata } from "next";
import { baseOg } from "../lib/seo";

import HomeBodyClient from "./HomebodyClient";


import { LoadingProvider, useLoading } from "@/Context/context/LoadingContext";

export async function generateMetadata(): Promise<Metadata> {
  return baseOg({
    title: "Reclaim, Refine, Reveiller",
    description:
      "Discover limited drops, hoodies, tees, tanks, accessories and lookbooks made with premium fabrics. Shop the latest from Reveiller Studios.",
    path: "/",
    type: "website",
  });
}


export default function Home() {
  return (
    <LoadingProvider>
      <HomeBodyClient/>
    </LoadingProvider>
  );
}
