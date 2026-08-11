import {
  Armchair,
  ArrowDown,
  BedDouble,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Sun,
  Tv,
  Users,
  Utensils,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, TouchEvent } from 'react'
import './App.css'
import {
  amenities,
  galleryGroups,
  interiorGroups,
  interiorSection,
  introMedia,
  navigation,
  outdoorFeatures,
  outdoorSection,
  propertyFacts,
  roomSection,
  rooms,
  secondaryExteriorMedia,
  siteConfig,
  type MediaItem,
} from './data/siteContent'

type IconName = keyof typeof iconMap

type LightboxState = {
  items: MediaItem[]
  index: number
  label: string
} | null

const iconMap = {
  Armchair,
  ArrowDown,
  BedDouble,
  CalendarDays,
  Camera,
  CookingPot,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Sun,
  Tv,
  Users,
  Utensils,
  X,
} satisfies Record<string, LucideIcon>

const baseInquiryText =
  'Bună ziua! Aș dori să verific disponibilitatea pentru Pădurea Cerbilor.'

function getIcon(name: string) {
  return iconMap[name as IconName] ?? Leaf
}

function whatsappUrl(message: string) {
  const number = siteConfig.contact.whatsapp.replace(/[^\d]/g, '')
  const text = encodeURIComponent(message)
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`
}

function hasValue(value: string) {
  return value.trim().length > 0
}

function phoneHref() {
  const phone = siteConfig.contact.telephone.replace(/[^\d+]/g, '')
  return phone ? `tel:${phone}` : ''
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

function MediaFrame({
  item,
  className = '',
  priority = false,
  caption = true,
}: {
  item: MediaItem
  className?: string
  priority?: boolean
  caption?: boolean
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <figure className={`media-frame ${className} ${failed ? 'media-failed' : ''}`}>
      <div className="media-placeholder" aria-hidden="true" />
      {!failed && (
        <img
          src={item.src}
          alt={item.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={loaded ? 'is-loaded' : ''}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      {caption && !failed && <figcaption>{item.caption}</figcaption>}
    </figure>
  )
}

function useImageLightbox() {
  const [lightboxState, setLightboxState] = useState<LightboxState>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const touchStartX = useRef<number | null>(null)

  const activeItem = lightboxState?.items[lightboxState.index] ?? null

  const openLightbox = (items: MediaItem[], index: number, label: string) => {
    previousFocus.current = document.activeElement as HTMLElement
    setLightboxState({ items, index, label })
  }

  const closeLightbox = () => {
    setLightboxState(null)
    previousFocus.current?.focus()
  }

  const showPrevious = () => {
    setLightboxState((current) =>
      current
        ? {
            ...current,
            index: (current.index - 1 + current.items.length) % current.items.length,
          }
        : current,
    )
  }

  const showNext = () => {
    setLightboxState((current) =>
      current ? { ...current, index: (current.index + 1) % current.items.length } : current,
    )
  }

  useEffect(() => {
    if (lightboxState !== null) {
      closeButtonRef.current?.focus()
      document.body.classList.add('lightbox-open')
    }

    return () => document.body.classList.remove('lightbox-open')
  }, [lightboxState])

  const onLightboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') closeLightbox()
    if (event.key === 'ArrowLeft') showPrevious()
    if (event.key === 'ArrowRight') showNext()
    if (event.key === 'Tab') {
      const focusable = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 48) return
    if (delta > 0) showPrevious()
    else showNext()
  }

  const lightbox = activeItem && lightboxState && (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Imagine mărită: ${activeItem.caption}`}
      onKeyDown={onLightboxKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        className="lightbox-backdrop"
        type="button"
        aria-label="Închide galeria"
        onClick={closeLightbox}
      />
      <div className="lightbox-panel">
        <button
          className="icon-button close-button"
          type="button"
          aria-label="Închide"
          ref={closeButtonRef}
          onClick={closeLightbox}
        >
          <X aria-hidden="true" />
        </button>
        <button
          className="icon-button prev-button"
          type="button"
          aria-label="Imaginea anterioară"
          onClick={showPrevious}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <MediaFrame item={activeItem} caption />
        <p className="lightbox-counter" aria-live="polite">
          Imaginea {lightboxState.index + 1} din {lightboxState.items.length} -{' '}
          {lightboxState.label}
        </p>
        <button
          className="icon-button next-button"
          type="button"
          aria-label="Imaginea următoare"
          onClick={showNext}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )

  return { openLightbox, lightbox }
}

function HeroMedia() {
  const reducedMotion = usePrefersReducedMotion()
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <div className="hero-media" aria-hidden="true">
      <MediaFrame
        item={{
          src: siteConfig.media.heroPoster,
          label: 'Poster video dronă',
          alt: '',
          caption: '',
          category: 'cabana',
        }}
        className="hero-poster"
        priority
        caption={false}
      />
      {!reducedMotion && !videoFailed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={siteConfig.media.heroPoster}
          onError={() => setVideoFailed(true)}
        >
          <source src={siteConfig.media.heroVideo} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled || open ? 'is-solid' : ''}`}>
      <a className="brand" href="#top" onClick={closeMenu}>
        {siteConfig.brandName}
      </a>
      <nav className="desktop-nav" aria-label="Navigație principală">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="#contact">
        Verifică disponibilitatea
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav
        id="mobile-menu"
        className="mobile-nav"
        aria-label="Navigație mobilă"
        hidden={!open}
      >
        {navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <a className="button button-primary" href="#contact" onClick={closeMenu}>
          Verifică disponibilitatea
        </a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="hero-section">
      <HeroMedia />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content reveal">
        <p className="eyebrow">{siteConfig.tagline}</p>
        <h1>{siteConfig.brandName}</h1>
        <p className="hero-lead">O cabană A-frame pentru familii și grupuri de prieteni.</p>
        <p className="hero-copy">
          Patru dormitoare duble, o zonă de zi primitoare, bucătărie, terasă, foișor
          și vatră de foc pentru zile așezate în ritmul locului.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            Verifică disponibilitatea
          </a>
          <a className="button button-secondary" href="#cabana">
            Descoperă cabana
          </a>
        </div>
      </div>
      <a className="scroll-indicator" href="#overview" aria-label="Derulează la prezentare">
        <ArrowDown aria-hidden="true" />
      </a>
    </section>
  )
}

function QuickFacts() {
  return (
    <section id="overview" className="facts-band" aria-label="Informații rapide">
      {propertyFacts.map((fact) => {
        const Icon = getIcon(fact.icon)
        return (
          <div className="fact-item" key={fact.value}>
            <Icon aria-hidden="true" />
            <span>{fact.value}</span>
          </div>
        )
      })}
    </section>
  )
}

function Intro() {
  return (
    <section id="cabana" className="section intro-section reveal">
      <div className="section-copy">
        <p className="section-kicker">Cabana</p>
        <h2>Lemn, lumină și forma caldă a unei cabane A-frame</h2>
        <p>
          Cabana îmbină forma A-frame cu finisaje din lemn, camere luminoase și
          spații comune în care vă puteți așeza la masă, povesti sau începe ziua
          în tihnă.
        </p>
      </div>
      <MediaFrame item={introMedia} className="intro-media" priority />
    </section>
  )
}

function Accommodation() {
  const [activeImages, setActiveImages] = useState<Record<string, number>>({})

  const imageForRoom = (roomId: string) => activeImages[roomId] ?? 0

  return (
    <section id="cazare" className="section accommodation-section reveal">
      <div className="section-heading">
        <p className="section-kicker">Camere</p>
        <h2>{roomSection.title}</h2>
        <p>{roomSection.description}</p>
      </div>
      <div className="room-grid" aria-label="Cele patru dormitoare duble">
        {rooms.map((room) => {
          const activeImage = imageForRoom(room.id)
          const media = room.images[activeImage] ?? room.images[0]

          return (
            <article className="room-item" key={room.id}>
              <MediaFrame item={media} caption={false} />
              <div className="room-copy">
                <div>
                  <h3>{room.title}</h3>
                  <p>{room.images.length} perspective ale aceleiași camere</p>
                </div>
                <div className="room-thumbnails" aria-label={`Fotografii pentru ${room.title}`}>
                  {room.images.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      className={activeImage === index ? 'is-active' : ''}
                      aria-label={`Afișează ${image.caption}`}
                      aria-pressed={activeImage === index}
                      onClick={() =>
                        setActiveImages((current) => ({ ...current, [room.id]: index }))
                      }
                    >
                      <img src={image.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function LivingKitchen() {
  const [activeImages, setActiveImages] = useState<Record<string, number>>({})
  const { openLightbox, lightbox } = useImageLightbox()

  const imageForGroup = (groupId: string) => activeImages[groupId] ?? 0

  return (
    <section id="interior" className="section common-section reveal">
      <div className="section-heading">
        <p className="section-kicker">Interior</p>
        <h2>{interiorSection.title}</h2>
        <p>{interiorSection.description}</p>
      </div>
      <div className="interior-layout">
        {interiorGroups.map((group, index) => {
          if ('roomGroups' in group) {
            return (
              <article className="interior-group interior-rooms" key={group.id}>
                <div className="interior-group-heading">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{group.title}</h3>
                  <p>{group.copy}</p>
                </div>
                <div className="interior-room-grid">
                  {group.roomGroups.map((room) => {
                    const activeImage = imageForGroup(room.id)
                    const media = room.images[activeImage] ?? room.images[0]

                    return (
                      <section className="interior-room-card" key={room.id}>
                        <button
                          className="image-open-button"
                          type="button"
                          aria-label={`Deschide imaginea pentru ${room.title}`}
                          onClick={() => openLightbox(room.images, activeImage, room.title)}
                        >
                          <MediaFrame item={media} caption={false} />
                        </button>
                        <div className="interior-card-copy">
                          <h4>{room.title}</h4>
                          <p>{room.images.length} perspective ale aceleiași camere</p>
                          <div
                            className="room-thumbnails"
                            aria-label={`Fotografii pentru ${room.title}`}
                          >
                            {room.images.map((image, imageIndex) => (
                              <button
                                type="button"
                                key={image.src}
                                className={activeImage === imageIndex ? 'is-active' : ''}
                                aria-label={`Afișează ${image.caption}`}
                                aria-pressed={activeImage === imageIndex}
                                onClick={() =>
                                  setActiveImages((current) => ({
                                    ...current,
                                    [room.id]: imageIndex,
                                  }))
                                }
                              >
                                <img src={image.src} alt="" loading="lazy" decoding="async" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </section>
                    )
                  })}
                </div>
              </article>
            )
          }

          const activeImage = imageForGroup(group.id)
          const media = group.images[activeImage] ?? group.images[0]

          return (
            <article className="interior-group" key={group.id}>
              <button
                className="image-open-button"
                type="button"
                aria-label={`Deschide imaginea pentru ${group.title}`}
                onClick={() => openLightbox(group.images, activeImage, group.title)}
              >
                <MediaFrame item={media} caption={false} />
              </button>
              <div className="interior-group-heading">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{group.title}</h3>
                <p>{group.copy}</p>
                <div className="room-thumbnails" aria-label={`Fotografii pentru ${group.title}`}>
                  {group.images.map((image, imageIndex) => (
                    <button
                      type="button"
                      key={image.src}
                      className={activeImage === imageIndex ? 'is-active' : ''}
                      aria-label={`Afișează ${image.caption}`}
                      aria-pressed={activeImage === imageIndex}
                      onClick={() =>
                        setActiveImages((current) => ({
                          ...current,
                          [group.id]: imageIndex,
                        }))
                      }
                    >
                      <img src={image.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {lightbox}
    </section>
  )
}

function ExteriorSection() {
  const [activeImages, setActiveImages] = useState<Record<string, number>>({})

  const imageForFeature = (featureId: string) => activeImages[featureId] ?? 0

  return (
    <section id="exterior" className="section exterior-section reveal">
      <div className="section-heading light">
        <p className="section-kicker">Experiențe în aer liber</p>
        <h2>{outdoorSection.title}</h2>
        <p>{outdoorSection.description}</p>
      </div>
      <div className="outdoor-feature-list">
        {outdoorFeatures.map((feature, index) => {
          const activeImage = imageForFeature(feature.id)
          const media = feature.images[activeImage] ?? feature.images[0]

          return (
            <article className="outdoor-feature" key={feature.id}>
              <MediaFrame item={media} caption={false} />
              <div className="outdoor-copy">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
                <div
                  className="outdoor-thumbnails"
                  aria-label={`Fotografii pentru ${feature.title}`}
                >
                  {feature.images.map((image, imageIndex) => (
                    <button
                      type="button"
                      key={image.src}
                      className={activeImage === imageIndex ? 'is-active' : ''}
                      aria-label={`Afișează ${image.caption}`}
                      aria-pressed={activeImage === imageIndex}
                      onClick={() =>
                        setActiveImages((current) => ({
                          ...current,
                          [feature.id]: imageIndex,
                        }))
                      }
                    >
                      <img src={image.src} alt="" loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Facilities() {
  return (
    <section id="facilitati" className="section facilities-section reveal">
      <div className="section-heading">
        <p className="section-kicker">Facilități</p>
        <h2>Ce găsiți în cabană</h2>
        <p>
          Am păstrat lista simplă și clară, cu dotările utile pentru planificarea
          unei șederi în familie sau cu prietenii.
        </p>
      </div>
      <div className="amenity-columns">
        {Object.entries(amenities).map(([group, items]) => (
          <div className="amenity-group" key={group}>
            <h3>{group}</h3>
            <ul>
              {items.map((item) => {
                const Icon = getIcon(item.icon)
                return (
                  <li key={item.label}>
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Gallery() {
  const [activeImages, setActiveImages] = useState<Record<string, number>>({})
  const galleryTouchStart = useRef<{ groupId: string; x: number } | null>(null)
  const { openLightbox, lightbox } = useImageLightbox()

  const imageForGroup = (groupId: string) => activeImages[groupId] ?? 0

  const setGroupImage = (groupId: string, index: number) => {
    setActiveImages((current) => ({ ...current, [groupId]: index }))
  }

  const showGalleryPrevious = (groupId: string, itemCount: number) => {
    setActiveImages((current) => {
      const currentIndex = current[groupId] ?? 0
      return { ...current, [groupId]: (currentIndex - 1 + itemCount) % itemCount }
    })
  }

  const showGalleryNext = (groupId: string, itemCount: number) => {
    setActiveImages((current) => {
      const currentIndex = current[groupId] ?? 0
      return { ...current, [groupId]: (currentIndex + 1) % itemCount }
    })
  }

  const onCarouselKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    groupId: string,
    itemCount: number,
  ) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showGalleryPrevious(groupId, itemCount)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showGalleryNext(groupId, itemCount)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const group = galleryGroups.find((item) => item.id === groupId)
      if (group) openLightbox(group.images, imageForGroup(groupId), group.title)
    }
  }

  const onCarouselTouchStart = (event: TouchEvent<HTMLElement>, groupId: string) => {
    galleryTouchStart.current = {
      groupId,
      x: event.changedTouches[0]?.clientX ?? 0,
    }
  }

  const onCarouselTouchEnd = (
    event: TouchEvent<HTMLElement>,
    groupId: string,
    itemCount: number,
  ) => {
    const touchStart = galleryTouchStart.current
    galleryTouchStart.current = null
    if (!touchStart || touchStart.groupId !== groupId) return
    const delta = event.changedTouches[0].clientX - touchStart.x
    if (Math.abs(delta) < 48) return
    if (delta > 0) showGalleryPrevious(groupId, itemCount)
    else showGalleryNext(groupId, itemCount)
  }

  return (
    <section id="galerie" className="section gallery-section reveal">
      <div className="section-heading">
        <p className="section-kicker">Galerie</p>
        <h2>Fotografii organizate pe categorii</h2>
        <p>
          Răsfoiți imaginile pe zone: cabana, interiorul, camerele și spațiile
          exterioare.
        </p>
      </div>
      <div className="gallery-category-list">
        {galleryGroups.map((group) => {
          const activeImage = imageForGroup(group.id)
          const media = group.images[activeImage] ?? group.images[0]
          const hasCarousel = group.images.length > 1

          return (
            <article
              className={`gallery-category ${hasCarousel ? 'has-carousel' : 'is-static'}`}
              key={group.id}
              tabIndex={0}
              onKeyDown={(event) =>
                hasCarousel && onCarouselKeyDown(event, group.id, group.images.length)
              }
              onTouchStart={(event) => hasCarousel && onCarouselTouchStart(event, group.id)}
              onTouchEnd={(event) =>
                hasCarousel && onCarouselTouchEnd(event, group.id, group.images.length)
              }
            >
              <div className="gallery-category-heading">
                <h3>{group.title}</h3>
                <p aria-live="polite">
                  Imaginea {activeImage + 1} din {group.images.length}
                </p>
              </div>
              <div className="gallery-carousel">
                {hasCarousel && (
                  <button
                    className="icon-button gallery-prev"
                    type="button"
                    aria-label="Imaginea anterioară"
                    onClick={() => showGalleryPrevious(group.id, group.images.length)}
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                )}
                <button
                  className="gallery-image-button"
                  type="button"
                  aria-label={`Deschide imaginea: ${media.caption}`}
                  onClick={() => openLightbox(group.images, activeImage, group.title)}
                >
                  <MediaFrame item={media} caption={false} />
                  <span>{media.caption}</span>
                </button>
                {hasCarousel && (
                  <button
                    className="icon-button gallery-next"
                    type="button"
                    aria-label="Imaginea următoare"
                    onClick={() => showGalleryNext(group.id, group.images.length)}
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                )}
              </div>
              {hasCarousel && (
                <div className="gallery-dots" aria-label={`Poziție în ${group.title}`}>
                  {group.images.map((image, index) => (
                    <button
                      type="button"
                      key={image.src}
                      className={activeImage === index ? 'is-active' : ''}
                      aria-label={`Imaginea ${index + 1} din ${group.images.length}`}
                      aria-pressed={activeImage === index}
                      onClick={() => setGroupImage(group.id, index)}
                    />
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>
      {lightbox}
    </section>
  )
}

function LocationSection() {
  return (
    <section id="locatie" className="section location-section reveal">
      <div className="section-copy">
        <p className="section-kicker">Locație</p>
        <h2>Accesul se stabilește la rezervare</h2>
        <p>
          Vă trimitem indicațiile de drum după stabilirea perioadei. Așa aveți
          traseul corect și toate detaliile utile înainte de sosire.
        </p>
      </div>
      <MediaFrame item={secondaryExteriorMedia} className="intro-media" />
    </section>
  )
}

type FormFields = {
  name: string
  arrival: string
  departure: string
  guests: string
  message: string
}

const initialForm: FormFields = {
  name: '',
  arrival: '',
  departure: '',
  guests: '',
  message: '',
}

function ContactSection() {
  const [form, setForm] = useState<FormFields>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({})
  const [status, setStatus] = useState('')
  const [preparedMessage, setPreparedMessage] = useState('')
  const hasWhatsapp = hasValue(siteConfig.contact.whatsapp)

  const updateField = (field: keyof FormFields, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
    setStatus('')
    setPreparedMessage('')
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormFields, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Introduceți numele.'
    if (!form.arrival.trim()) nextErrors.arrival = 'Introduceți data sosirii.'
    if (!form.departure.trim()) nextErrors.departure = 'Introduceți data plecării.'
    if (!form.guests || Number(form.guests) < 1) {
      nextErrors.guests = 'Introduceți numărul de persoane.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const composeMessage = () => {
    const lines = [
      baseInquiryText,
      `Nume: ${form.name}`,
      `Sosire: ${form.arrival}`,
      `Plecare: ${form.departure}`,
      `Număr persoane: ${form.guests}`,
      form.message ? `Mesaj: ${form.message}` : null,
    ].filter(Boolean)
    return lines.join('\n')
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return
    const message = composeMessage()
    if (hasWhatsapp) {
      window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
      return
    }
    setPreparedMessage(message)
    try {
      await navigator.clipboard?.writeText(message)
      setStatus('Mesajul a fost pregătit și copiat.')
    } catch {
      setStatus('Mesajul a fost pregătit mai jos.')
    }
  }

  const errorList = Object.values(errors)
  const directContacts = [
    siteConfig.contact.telephone
      ? { icon: Phone, label: 'Telefon', value: siteConfig.contact.telephone, href: phoneHref() }
      : null,
    siteConfig.contact.email
      ? { icon: Mail, label: 'Email', value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` }
      : null,
    siteConfig.contact.facebook
      ? { icon: Share2, label: 'Facebook', value: 'Pagina oficială', href: siteConfig.contact.facebook }
      : null,
    siteConfig.contact.instagram
      ? { icon: Camera, label: 'Instagram', value: 'Profil Instagram', href: siteConfig.contact.instagram }
      : null,
  ].filter(Boolean)

  return (
    <section id="contact" className="section contact-section reveal">
      <div className="section-heading">
        <p className="section-kicker">Disponibilitate</p>
        <h2>Pregătiți mesajul pentru rezervare</h2>
        <p>
          Formularul generează un mesaj în limba română. Trimiterea solicitării
          nu reprezintă confirmarea automată a rezervării.
        </p>
      </div>
      <div className={`contact-layout ${directContacts.length === 0 ? 'is-solo' : ''}`}>
        <form className="inquiry-form" noValidate onSubmit={onSubmit}>
          {errorList.length > 0 && (
            <div className="form-errors" role="alert" aria-live="polite">
              <p>Verificați câmpurile marcate:</p>
              <ul>
                {errorList.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {status && (
            <p className="form-status" role="status">
              {status}
            </p>
          )}
          {preparedMessage && (
            <label className="prepared-message-label full">
              <span>Mesaj pregătit</span>
              <textarea
                className="prepared-message"
                readOnly
                rows={7}
                value={preparedMessage}
                aria-label="Mesaj pregătit pentru WhatsApp"
              />
            </label>
          )}
          <label>
            <span>Nume</span>
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'error-name' : undefined}
              autoComplete="name"
            />
            {errors.name && <small id="error-name">{errors.name}</small>}
          </label>
          <label>
            <span>Data sosirii</span>
            <input
              value={form.arrival}
              placeholder="ex. 10.09.2026"
              onChange={(event) => updateField('arrival', event.target.value)}
              aria-invalid={Boolean(errors.arrival)}
              aria-describedby={errors.arrival ? 'error-arrival' : undefined}
              inputMode="numeric"
            />
            {errors.arrival && <small id="error-arrival">{errors.arrival}</small>}
          </label>
          <label>
            <span>Data plecării</span>
            <input
              value={form.departure}
              placeholder="ex. 12.09.2026"
              onChange={(event) => updateField('departure', event.target.value)}
              aria-invalid={Boolean(errors.departure)}
              aria-describedby={errors.departure ? 'error-departure' : undefined}
              inputMode="numeric"
            />
            {errors.departure && <small id="error-departure">{errors.departure}</small>}
          </label>
          <label>
            <span>Număr de persoane</span>
            <input
              type="number"
              min="1"
              value={form.guests}
              onChange={(event) => updateField('guests', event.target.value)}
              aria-invalid={Boolean(errors.guests)}
              aria-describedby={errors.guests ? 'error-guests' : undefined}
            />
            {errors.guests && <small id="error-guests">{errors.guests}</small>}
          </label>
          <label className="full">
            <span>Mesaj</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
            />
          </label>
          <button className="button button-primary full" type="submit">
            <MessageCircle aria-hidden="true" />
            {hasWhatsapp ? 'Trimite pe WhatsApp' : 'Copiază mesajul'}
          </button>
        </form>
        {directContacts.length > 0 && (
          <aside className="direct-contact" aria-label="Contact direct">
            {directContacts.map((contact) => {
              if (!contact) return null
              const Icon = contact.icon
              return (
                <a
                  className="contact-action"
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}
                  key={contact.label}
                >
                  <Icon aria-hidden="true" />
                  <span>{contact.label}</span>
                  <strong>{contact.value}</strong>
                </a>
              )
            })}
          </aside>
        )}
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="final-cta reveal">
      <MediaFrame item={introMedia} caption={false} />
      <div>
        <h2>Următoarea escapadă poate începe cu un mesaj simplu.</h2>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            Verifică disponibilitatea
          </a>
          <a className="button button-secondary dark" href="#galerie">
            Vezi galeria
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{siteConfig.brandName}</strong>
        <p>{siteConfig.tagline}</p>
      </div>
      <nav aria-label="Navigație footer">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <small>© {new Date().getFullYear()} {siteConfig.brandName}. Toate drepturile rezervate.</small>
    </footer>
  )
}

function MobileActionBar() {
  return (
    <div className="mobile-action-bar" aria-label="Acțiuni rapide">
      <a href="#contact">
        <CalendarDays aria-hidden="true" />
        Disponibilitate
      </a>
      <a href="#galerie">
        <Camera aria-hidden="true" />
        Galerie
      </a>
      <a href="#locatie">
        <MapPin aria-hidden="true" />
        Locație
      </a>
    </div>
  )
}

function StructuredData() {
  const sameAs = [
    siteConfig.contact.facebook,
    siteConfig.contact.instagram,
  ].filter(Boolean)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: siteConfig.brandName,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RO',
    },
    image: siteConfig.media.socialShare,
    numberOfRooms: 4,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Foișor' },
      { '@type': 'LocationFeatureSpecification', name: 'Vatră de foc' },
      { '@type': 'LocationFeatureSpecification', name: 'Terasă exterioară' },
      { '@type': 'LocationFeatureSpecification', name: 'Bucătărie' },
    ],
    ...(siteConfig.contact.telephone ? { telephone: siteConfig.contact.telephone } : {}),
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

function App() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <QuickFacts />
        <Intro />
        <Accommodation />
        <LivingKitchen />
        <ExteriorSection />
        <Facilities />
        <Gallery />
        <LocationSection />
        <ContactSection />
        <FinalCta />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}

export default App
