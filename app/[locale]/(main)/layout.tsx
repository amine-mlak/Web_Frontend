import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InstagramFeed from "@/components/InstagramFeed";
import { PreviewBanner } from "@/components/PreviewBanner";
import SiteHeader from "@/components/SiteHeader";
import { getAnnouncement } from "@/lib/announcement";
import { getRequestLocale } from "@/lib/locale";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const announcement = await getAnnouncement(await getRequestLocale());

  return (
    <>
      <PreviewBanner />
      <SiteHeader top={announcement ? <AnnouncementBar announcement={announcement} /> : undefined}>
        <Header />
      </SiteHeader>
      {children}
      <InstagramFeed />
      <Footer />
    </>
  );
}
