"use client";

import { useLoading } from "@/Context/context/LoadingContext";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import Loading from "@/components/Loading/Loading";
import ThreeSketch from "@/components/Canvas/ThreeSketch";
import Newsletter from "@/components/Newsletter/Newsletter";

export default function HomeBodyClient() {
  const { loading } = useLoading();

  return (
    <>
      <Navigation />
      {loading ? (
        <Loading />
      ) : (
        <main className="flex items-center flex-col relative overflow-x-hidden min-h-200">
          <Newsletter />
          <ThreeSketch />
        </main>
      )}
      <Footer />
    </>
  );
}