import {
  apiPlugin,
  setComponents,
  storyblokInit,
} from "@storyblok/react/rsc";
import type { ISbStoryData, StoryblokClient } from "@storyblok/react/rsc";
import {
  BannerReference,
  BlueprintButton,
  DefaultPage,
  FeaturedArticlesSection,
  GridCard,
  GridSection,
  HeadlineSegment,
  HeroSection,
  ImageTextSection,
  FaqEntry,
  FaqSection,
  NewsletterFormSection,
  TabbedContentEntry,
  TabbedContentSection,
} from "@/components/storyblok/blueprint";
import Cta from "@/components/storyblok/Cta";
import Feature from "@/components/storyblok/Feature";
import FeatureGrid from "@/components/storyblok/FeatureGrid";
import Grid from "@/components/storyblok/Grid";
import LandingPage, { NestedBlok } from "@/components/storyblok/LandingPage";
import Page from "@/components/storyblok/Page";
import Quote from "@/components/storyblok/Quote";
import Teaser from "@/components/storyblok/Teaser";
import { fallbackStoryblokStory } from "@/lib/storyblok-fallback";

const components = {
  page: Page,
  landing: LandingPage,
  "default-page": DefaultPage,
  hero: NestedBlok,
  hero_slide: NestedBlok,
  kacheln: NestedBlok,
  kachel: NestedBlok,
  ablauf: NestedBlok,
  ablauf_step: NestedBlok,
  entdecken: NestedBlok,
  entdecken_panel: NestedBlok,
  faq: NestedBlok,
  faq_item: NestedBlok,
  beratung: NestedBlok,
  feature_grid: FeatureGrid,
  feature: Feature,
  quote: Quote,
  cta: Cta,
  teaser: Teaser,
  grid: Grid,
  button: BlueprintButton,
  "headline-segment": HeadlineSegment,
  "hero-section": HeroSection,
  "tabbed-content-section": TabbedContentSection,
  "tabbed-content-entry": TabbedContentEntry,
  "grid-section": GridSection,
  "grid-card": GridCard,
  "image-text-section": ImageTextSection,
  "newsletter-form-section": NewsletterFormSection,
  "faq-section": FaqSection,
  "faq-entry": FaqEntry,
  "featured-articles-section": FeaturedArticlesSection,
  "banner-reference": BannerReference,
};

setComponents(components);

function accessToken() {
  return (
    process.env.STORYBLOK_DELIVERY_API_TOKEN ??
    process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN ??
    ""
  );
}

let storyblokApi: StoryblokClient | null | undefined;

export function getStoryblokApi(): StoryblokClient | null {
  if (storyblokApi !== undefined) {
    return storyblokApi;
  }

  const token = accessToken();
  if (!token) {
    storyblokApi = null;
    return null;
  }

  storyblokApi = storyblokInit({
    accessToken: token,
    use: [apiPlugin],
    components,
    enableFallbackComponent: true,
    apiOptions: {
      region: process.env.STORYBLOK_REGION || "eu",
    },
  })();

  return storyblokApi;
}

export type StoryblokSource = "storyblok" | "fallback";

export async function fetchStoryblokDemoStory(
  slug = "home",
): Promise<{
  story: ISbStoryData;
  source: StoryblokSource;
}> {
  const api = getStoryblokApi();
  if (!api) {
    return { story: fallbackStoryblokStory, source: "fallback" };
  }

  const version =
    process.env.STORYBLOK_VERSION === "published" ? "published" : "draft";
  const candidates =
    !slug || slug === "home" || slug === "storyblok"
      ? ["home", "storyblok"]
      : [slug, "home"];

  for (const path of candidates) {
    try {
      const { data } = await api.get(`cdn/stories/${path}`, { version });
      if (data?.story) {
        return { story: data.story, source: "storyblok" };
      }
    } catch {
      // try next slug
    }
  }

  return { story: fallbackStoryblokStory, source: "fallback" };
}
