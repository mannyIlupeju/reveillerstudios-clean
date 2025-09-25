import React from 'react'
import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'


export const metadata:Metadata = {
  title: "About",
  description: "This isn`t just fashion — it`s a manifesto. Meet the minds behind the movement blending design, punk energy, and sharp marketing to disrupt the streets and the retail space."
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      <main className="flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default layout
