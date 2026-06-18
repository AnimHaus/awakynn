import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { journal } from "../../lib/data";
import JournalStory from "../../components/JournalStory";

export function generateStaticParams() {
  return journal.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = journal.find((p) => p.slug === slug);
  if (!post) return { title: "Journal — Awakynn" };
  return {
    title: `${post.title} | Awakynn Journal`,
    description: post.excerpt,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = journal.find((p) => p.slug === slug);
  if (!post) notFound();
  return <JournalStory post={post} />;
}
