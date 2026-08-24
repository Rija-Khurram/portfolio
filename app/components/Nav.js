import Link from "next/link"

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/chat", label: "Chat" },
  { href: "/contact", label: "Contact" },
]

export default function Nav() {
  return (
    <nav className="border-b border-lavender/30 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <span
          className="text-xl italic text-plum"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          RK
        </span>
        <div className="flex gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-plum after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sky after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
