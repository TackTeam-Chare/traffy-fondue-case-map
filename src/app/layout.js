import localFont from "next/font/local";
import "./globals.css";

// Import Anuphan (Variable Font)
const anuphan = localFont({
  src: "./fonts/Anuphan-VariableFont_wght.ttf",
  variable: "--font-anuphan",
  weight: "100 900",
});

// Import Supreme fonts with different weights
const supremeBold = localFont({
  src: "./fonts/Supreme-Bold.otf",
  variable: "--font-supreme-bold",
});
const supremeExtrabold = localFont({
  src: "./fonts/Supreme-Extrabold.otf",
  variable: "--font-supreme-extrabold",
});
const supremeMedium = localFont({
  src: "./fonts/Supreme-Medium.otf",
  variable: "--font-supreme-medium",
});
const supremeRegular = localFont({
  src: "./fonts/Supreme-Regular.otf",
  variable: "--font-supreme-regular",
});

export const metadata = {
  title: "ตรวจงานที่ดำเนินการเเก้ไขเสร็จสิ้น",
  description: "หน้าตรวจงานที่ดำเนินการเเก้ไขเสร็จสิ้นทราฟฟี่ฟองดูว์",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${anuphan.variable} ${supremeBold.variable} ${supremeExtrabold.variable} ${supremeMedium.variable} ${supremeRegular.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}