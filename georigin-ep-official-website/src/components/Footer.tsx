import { motion } from 'framer-motion'
import { SOCIALS } from '@/lib/site'

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18.6 5.3A16 16 0 0 0 14.6 4l-.3.6a13 13 0 0 1 3.6 1.8 12.5 12.5 0 0 0-11.8 0A13 13 0 0 1 9.7 4.6L9.4 4a16 16 0 0 0-4 1.3C2.9 9.1 2.2 12.8 2.5 16.4a16 16 0 0 0 4.9 2.5l.8-1.3a10 10 0 0 1-1.7-.8l.4-.3a11.4 11.4 0 0 0 10.2 0l.4.3a10 10 0 0 1-1.7.8l.8 1.3a16 16 0 0 0 4.9-2.5c.4-4.1-.7-7.7-2.9-11.1Z" />
      <circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

const SOCIAL_ITEMS = [
  { label: 'Discord', href: SOCIALS.discord, icon: DiscordIcon },
  { label: 'X', href: SOCIALS.x, icon: XIcon },
  { label: 'Instagram', href: SOCIALS.instagram, icon: InstagramIcon },
  { label: 'YouTube', href: SOCIALS.youtube, icon: YoutubeIcon },
]

export default function Footer() {
  return (
    <footer className="bg-ep-footer text-white">
      <div className="mx-auto flex max-w-ep flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row lg:px-16">
        <p className="font-mono text-[12.5px] tracking-[0.06em] text-white/70">
          © 2026 <span className="font-bold text-ep-accent">GEORIGIN</span> — useful · creative · simple
        </p>
        <nav className="flex items-center gap-5" aria-label="Social links">
          {SOCIAL_ITEMS.map(({ label, href, icon: Icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener"
              aria-label={label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
              className="text-[#777] transition-all duration-200 hover:-translate-y-0.5 hover:text-ep-accent"
            >
              <Icon />
            </motion.a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
