export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1
        className="text-3xl italic text-plum mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Contact
      </h1>
      <p className="text-plum/70 mb-6">
        Interested in working together? The fastest way to reach me:
      </p>
      <a
        href="mailto:rijakhurram200@gmail.com"
        className="inline-block bg-sky text-plum px-6 py-3 rounded-lg font-medium hover:bg-lavender transition"
      >
        Email me
      </a>
    </div>
  )
}
