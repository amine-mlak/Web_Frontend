import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InstagramFeed from "@/components/InstagramFeed";
import { PreviewBanner } from "@/components/PreviewBanner";
import SiteHeader from "@/components/SiteHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PreviewBanner />
      <SiteHeader>
        <Header />
      </SiteHeader>
      {children}
      <InstagramFeed />
      <Footer />
    </>
  );
}
