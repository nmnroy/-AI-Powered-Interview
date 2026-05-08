import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Questions | Interview Prep AI",
  description: "Turn any job description into tailored technical and behavioral interview questions.",
};

export default function GenerateSegmentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
