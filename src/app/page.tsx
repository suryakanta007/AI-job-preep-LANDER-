import { ThemeToggle } from "@/components/ThemeToggle";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <SignInButton/>
      <UserButton/>
      <ThemeToggle/>
      <PricingTable/>
    </>
  );
}
