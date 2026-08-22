import { Playfair_Display, Nunito } from "next/font/google"
import Nav from "./components/Nav"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

export const metadata = {
  title: "Rija Khurram — Portfolio",
  description: "Complex features, simple interfaces.",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${nunito.variable}`} style={{ fontFamily: "var(--font-nunito)" }}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
