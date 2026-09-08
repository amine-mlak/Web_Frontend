import { StoryblokStory } from "@storyblok/react/rsc";
import DemoChrome from "@/components/storyblok/DemoChrome";
import LandingPage from "@/components/storyblok/LandingPage";
import { fetchStoryblokDemoStory } from "@/lib/storyblok";

export const revalidate = 60;

export default async function StoryblokDemoPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = slug?.length ? slug.join("/") : "home";
  const { story, source } = await fetchStoryblokDemoStory(path);

  return (
    <>
      <DemoChrome source={source} />
      {source === "storyblok" ? (
        <StoryblokStory story={story} />
      ) : (
        <LandingPage blok={story.content} />
      )}
    </>
  );
}
