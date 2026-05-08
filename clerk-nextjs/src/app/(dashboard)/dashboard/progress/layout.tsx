import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress | Interview Prep AI",
  description: "Track your interview practice trends, scores, and historical answers.",
};

export default function ProgressSegmentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
