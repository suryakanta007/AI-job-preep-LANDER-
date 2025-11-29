import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <SignInButton/>
      <UserButton/>
    </>
  );
}
