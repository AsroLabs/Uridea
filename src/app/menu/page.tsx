"use client"

import MenuHeader from "./components/layout/MenuHeader";
import HeroSection from "./components/layout/HeroSection";
import CardSection from "./components/layout/CardSection";
import JoinSection from "./components/layout/JoinSection";

export default function Menu() {
  return (
    <main>
      <MenuHeader />
      <HeroSection />
      <CardSection />
      <JoinSection />
    </main>
  )
}