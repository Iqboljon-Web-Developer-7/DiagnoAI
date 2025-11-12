import { Header } from "@/components/layout/Header/header";
import { Footer } from "@/components/layout/footer";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* @ts-expect-error Async Server Component */}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
