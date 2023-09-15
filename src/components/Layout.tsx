import { Inter } from "next/font/google";

interface LayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: LayoutProps) => {
  return (
    <main
      className={`${inter.className} flex flex-col items-center h-screen bg-stone-300 w-screen md:py-6 md:px-8`}
    >
      <section className="border border-black rounded md:p-5 shadow bg-stone-50 w-full md:max-w-4xl">
        {children}
      </section>
    </main>
  );
};

export default Layout;
