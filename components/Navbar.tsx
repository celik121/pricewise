import Image from 'next/image'
import Link from 'next/link'

const navIcons = [
  { src: '/assets/icons/notification.svg', alt: 'search' },
  { src: '/assets/icons/heart.svg', alt: 'heart' },
  { src: '/assets/icons/profile.svg', alt: 'user' },
]

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          

          <p className="nav-logo">
            PriceWise
          </p>
        </Link>

        <div className="flex items-center gap-4">
          {navIcons.map((icon) => (
            <Image 
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              width={28}
              height={28}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar