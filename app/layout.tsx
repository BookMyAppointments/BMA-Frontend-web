import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import Provider from "./provider";
import { ToastContainer } from "react-toastify";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookMyAppointments",
    template: "%s · BookMyAppointments",
  },
  description:
    "Find a doctor, book a slot, and get lab tests done near you. Appointments confirmed on WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#0D7A6F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${jakarta.variable} antialiased`}>
        <Provider>
          {children}
          <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar
            newestOnTop
            closeButton={false}
            toastClassName="!rounded-[14px] !border !border-line !bg-surface !text-ink !shadow-md !font-sans"
          />
        </Provider>
      </body>
    </html>
  );
}
