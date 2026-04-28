import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientMain from "@/components/ClientMain";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ClientMain>{children}</ClientMain>
      <Footer />
    </>
  );
}
