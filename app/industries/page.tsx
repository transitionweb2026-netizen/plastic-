import type { Metadata } from "next";
import IndustriesContent from "@/components/industries/IndustriesContent";

export const metadata: Metadata = {
  title: "Industries & Manufacturing",
  description:
    "Inside Giant Storage's Cairo production facility: 5-stage manufacturing workflow, AI-driven robotics, and certified solutions for automotive, pharma, food, logistics, agriculture, and electronics.",
};

export default function IndustriesPage() {
  return <IndustriesContent />;
}
