import { getStoryblokApi } from "@/lib/storyblok";

/** Registers Storyblok bloks for this route only. */
export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  getStoryblokApi();
  return children;
}
