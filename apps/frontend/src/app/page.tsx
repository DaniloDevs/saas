import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="text-5xl italic">
          Mysthic Cheet
        </h1>
        <Button className="w-28" size="sm" asChild>
          <Link href="/auth/sign-in">
            Sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
