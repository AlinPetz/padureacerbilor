import { WHATSAPP_DISPLAY_NUMBER } from '../utils/whatsapp'

export type MediaCategory =
  | 'cabana'
  | 'camere'
  | 'interior'
  | 'exterior'
  | 'foisor'
  | 'vatra-de-foc'

export type MediaItem = {
  src: string
  label: string
  alt: string
  caption: string
  category: MediaCategory
}

export type AmenityItem = {
  icon: string
  label: string
}

export type RoomItem = {
  id: string
  title: string
  images: MediaItem[]
}

export type OutdoorFeature = {
  id: string
  title: string
  copy: string
  images: MediaItem[]
}

export type InteriorGroup =
  | {
      id: 'living' | 'bucatarie-zona-masa'
      title: string
      copy: string
      images: MediaItem[]
    }
  | {
      id: 'camere'
      title: string
      copy: string
      roomGroups: RoomItem[]
    }

export type GalleryGroup = {
  id: MediaCategory
  title: string
  images: MediaItem[]
}

export const siteConfig = {
  brandName: 'Pădurea Cerbilor',
  tagline: 'Cabană A-frame în natură',
  description:
    'Pădurea Cerbilor este o cabană A-frame cu patru dormitoare duble, foișor, vatră de foc, zonă de zi, bucătărie și terasă, potrivită pentru familii și grupuri de prieteni.',
  contact: {
    whatsapp: WHATSAPP_DISPLAY_NUMBER,
    telephone: '',
    email: '',
    facebook: '',
    instagram: '',
  },
  location: {
    general: '',
    publicNote: '',
    nearbyAttractions: [] as string[],
  },
  media: {
    heroVideo: 'media/video/hero-drona.mp4',
    heroPoster: 'media/hero-poster.webp',
    socialShare: 'https://padureacerbilor.ro/media/social-share.webp',
  },
}

export const navigation = [
  { label: 'Cabana', href: '#cabana' },
  { label: 'Camere', href: '#cazare' },
  { label: 'Facilități', href: '#facilitati' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Locație', href: '#locatie' },
  { label: 'Contact', href: '#contact' },
]

export const propertyFacts = [
  { icon: 'BedDouble', value: '4 dormitoare duble' },
  { icon: 'Armchair', value: 'Zonă de zi pentru relaxare' },
  { icon: 'CookingPot', value: 'Bucătărie deschisă' },
  { icon: 'Utensils', value: 'Zonă de luat masa' },
  { icon: 'Home', value: 'Cabană A-frame din lemn' },
  { icon: 'Leaf', value: 'Foișor și vatră de foc' },
]

export const introMedia: MediaItem = {
  src: 'media/exterior/cabana-exterior-01.webp',
  label: 'Exterior cabană A-frame',
  alt: 'Cabana A-frame Pădurea Cerbilor văzută din exterior, într-un cadru natural',
  caption: 'Exteriorul cabanei A-frame',
  category: 'cabana',
}

export const secondaryExteriorMedia: MediaItem = {
  src: 'media/exterior/cabana-exterior-02.webp',
  label: 'Terasă și exterior',
  alt: 'Terasă din lemn și fațada cabanei Pădurea Cerbilor',
  caption: 'Terasă și fațadă',
  category: 'exterior',
}

export const roomSection = {
  title: 'Patru camere pentru odihnă și liniște',
  description:
    'Cabana dispune de patru dormitoare duble, potrivite pentru familii și grupuri de prieteni.',
}

export const rooms: RoomItem[] = [
  {
    id: 'camera-1',
    title: 'Camera 1',
    images: [
      {
        src: 'media/camere/camera-1-vedere-spre-pat.webp',
        label: 'Camera 1',
        alt: 'Camera 1 - vedere spre pat',
        caption: 'Camera 1 - vedere spre pat',
        category: 'camere',
      },
      {
        src: 'media/camere/camera-1-vedere-apropiata.webp',
        label: 'Camera 1',
        alt: 'Camera 1 - vedere apropiată spre pat',
        caption: 'Camera 1 - vedere apropiată',
        category: 'camere',
      },
      {
        src: 'media/camere/camera-1-vedere-generala.webp',
        label: 'Camera 1',
        alt: 'Camera 1 - vedere generală',
        caption: 'Camera 1 - vedere generală',
        category: 'camere',
      },
    ],
  },
  {
    id: 'camera-2',
    title: 'Camera 2',
    images: [
      {
        src: 'media/camere/dormitor-02-pat-dublu.webp',
        label: 'Camera 2',
        alt: 'Camera 2 - vedere spre pat',
        caption: 'Camera 2 - vedere spre pat',
        category: 'camere',
      },
      {
        src: 'media/camere/dormitor-02-lemn.webp',
        label: 'Camera 2',
        alt: 'Camera 2 - vedere din lateral',
        caption: 'Camera 2 - vedere din lateral',
        category: 'camere',
      },
    ],
  },
  {
    id: 'camera-3',
    title: 'Camera 3',
    images: [
      {
        src: 'media/camere/dormitor-03-vedere.webp',
        label: 'Camera 3',
        alt: 'Camera 3 - vedere spre pat',
        caption: 'Camera 3 - vedere spre pat',
        category: 'camere',
      },
      {
        src: 'media/camere/dormitor-03-a-frame.webp',
        label: 'Camera 3',
        alt: 'Camera 3 - vedere generală',
        caption: 'Camera 3 - vedere generală',
        category: 'camere',
      },
    ],
  },
  {
    id: 'camera-4',
    title: 'Camera 4',
    images: [
      {
        src: 'media/camere/camera-4-vedere-spre-pat.webp',
        label: 'Camera 4',
        alt: 'Camera 4 - vedere spre pat',
        caption: 'Camera 4 - vedere spre pat',
        category: 'camere',
      },
      {
        src: 'media/camere/dormitor-04-pat-dublu.webp',
        label: 'Camera 4',
        alt: 'Camera 4 - vedere generală',
        caption: 'Camera 4 - vedere generală',
        category: 'camere',
      },
    ],
  },
]

export const roomMedia: MediaItem[] = rooms.flatMap((room) => room.images)

export const commonSpaces: Array<{
  title: string
  copy: string
  media: MediaItem
}> = [
  {
    title: 'Living',
    copy:
      'Zona de zi adună canapeaua, televizorul și detaliile din lemn într-un loc comod pentru seri liniștite.',
    media: {
      src: 'media/living/living-coltar.webp',
      label: 'Living',
      alt: 'Living cu colțar turcoaz, leagăn interior și finisaje din lemn',
      caption: 'Living cu zonă de relaxare',
      category: 'interior',
    },
  },
  {
    title: 'Living și scară interioară',
    copy:
      'Spațiul comun leagă zona de zi de masa lungă și de scara interioară, astfel încât casa rămâne aerisită și ușor de folosit.',
    media: {
      src: 'media/living/living-tv-scara.webp',
      label: 'Living și scară',
      alt: 'Living cu televizor, scară interioară și structură din lemn',
      caption: 'Living și scară interioară',
      category: 'interior',
    },
  },
  {
    title: 'Zona de luat masa',
    copy:
      'Masa lungă este așezată aproape de zona de zi și de bucătărie, potrivită pentru micul dejun, cine în grup sau jocuri de seară.',
    media: {
      src: 'media/living/masa-zona-luat-masa.webp',
      label: 'Zona de luat masa',
      alt: 'Masă lungă, cu scaune și decorațiuni florale',
      caption: 'Zonă de luat masa',
      category: 'interior',
    },
  },
  {
    title: 'Bucătărie',
    copy:
      'Bucătăria este luminoasă și practică, cu blat de lucru, chiuvetă, plită și fereastră spre exterior.',
    media: {
      src: 'media/bucatarie/bucatarie-plita-vedere.webp',
      label: 'Bucătărie',
      alt: 'Bucătărie cu blat, chiuvetă, plită și fereastră spre exterior',
      caption: 'Bucătărie deschisă',
      category: 'interior',
    },
  },
]

export const livingMedia: MediaItem[] = [
  commonSpaces[0].media,
  commonSpaces[1].media,
  {
    src: 'media/living/zona-zi-luat-masa.webp',
    label: 'Living',
    alt: 'Livingul și zona de luat masa din cabana Pădurea Cerbilor',
    caption: 'Living și zonă de luat masa',
    category: 'interior',
  },
]

export const kitchenDiningMedia: MediaItem[] = [
  commonSpaces[2].media,
  commonSpaces[3].media,
  {
    src: 'media/living/zona-luat-masa-luminoasa.webp',
    label: 'Zona de luat masa',
    alt: 'Zona de luat masa luminoasă',
    caption: 'Zona de luat masa luminoasă',
    category: 'interior',
  },
]

export const interiorSection = {
  title: 'Interiorul cabanei',
  description:
    'Spațiile interioare sunt organizate pentru confortul întregului grup, de la camerele duble până la living, bucătărie și zona de luat masa.',
}

export const interiorGroups: InteriorGroup[] = [
  {
    id: 'living',
    title: 'Living',
    copy:
      'Livingul adună zona de relaxare, televizorul și detaliile din lemn într-un spațiu comun ușor de folosit.',
    images: livingMedia,
  },
  {
    id: 'bucatarie-zona-masa',
    title: 'Bucătărie și zona de luat masa',
    copy:
      'Bucătăria și masa casei sunt aproape de zona de zi, potrivite pentru mesele luate împreună.',
    images: kitchenDiningMedia,
  },
  {
    id: 'camere',
    title: 'Cele patru camere',
    copy:
      'Cabana are patru dormitoare duble, fiecare prezentat ca un grup separat de fotografii.',
    roomGroups: rooms,
  },
]

export const outdoorSection = {
  title: 'Zile în aer liber, seri în jurul focului',
  description:
    'Spațiile exterioare sunt pregătite pentru mese petrecute împreună, momente de relaxare și seri liniștite în jurul focului.',
}

export const outdoorFeatures: OutdoorFeature[] = [
  {
    id: 'foisor',
    title: 'Foișorul',
    copy:
      'Foișorul oferă un spațiu potrivit pentru mese și timp petrecut împreună în aer liber.',
    images: [
      {
        src: 'media/foisor/foisor-exterior-vedere-generala.webp',
        label: 'Foișor',
        alt: 'Foișorul de la Pădurea Cerbilor',
        caption: 'Foișorul de la Pădurea Cerbilor',
        category: 'foisor',
      },
      {
        src: 'media/foisor/foisor-langa-cabana.webp',
        label: 'Foișor',
        alt: 'Foișorul văzut din curtea cabanei',
        caption: 'Foișorul văzut din curte',
        category: 'foisor',
      },
    ],
  },
  {
    id: 'vatra-de-foc',
    title: 'Seri în jurul focului',
    copy:
      'Vatra de foc completează serile petrecute afară și oferă un loc plăcut pentru momente liniștite alături de familie sau prieteni.',
    images: [
      {
        src: 'media/vatra-de-foc/vatra-de-foc-zona-amenajata.webp',
        label: 'Vatră de foc',
        alt: 'Vatra de foc exterioară de la Pădurea Cerbilor',
        caption: 'Vatra de foc exterioară',
        category: 'vatra-de-foc',
      },
      {
        src: 'media/vatra-de-foc/vatra-de-foc-in-curte.webp',
        label: 'Vatră de foc',
        alt: 'Zona amenajată în jurul vetrei de foc',
        caption: 'Zona amenajată în jurul vetrei de foc',
        category: 'vatra-de-foc',
      },
      {
        src: 'media/vatra-de-foc/vatra-de-foc-vedere-curte.webp',
        label: 'Vatră de foc',
        alt: 'Vatra de foc din curtea cabanei',
        caption: 'Vatra de foc din curtea cabanei',
        category: 'vatra-de-foc',
      },
    ],
  },
]

export const outdoorMedia: MediaItem[] = outdoorFeatures.flatMap((feature) => feature.images)

export const interiorMedia: MediaItem[] = [...livingMedia, ...kitchenDiningMedia]

export const amenities: Record<string, AmenityItem[]> = {
  Interior: [
    { icon: 'BedDouble', label: 'Patru dormitoare duble' },
    { icon: 'Armchair', label: 'Zonă de zi' },
    { icon: 'Tv', label: 'Televizor' },
    { icon: 'Utensils', label: 'Zonă de luat masa' },
    { icon: 'CookingPot', label: 'Bucătărie cu plită, chiuvetă și blat de lucru' },
  ],
  Exterior: [
    { icon: 'Home', label: 'Cabană A-frame' },
    { icon: 'Leaf', label: 'Cadru natural' },
    { icon: 'Sun', label: 'Terasă exterioară' },
    { icon: 'Utensils', label: 'Foișor' },
    { icon: 'Leaf', label: 'Vatră de foc' },
  ],
}

const baseGalleryGroups: GalleryGroup[] = [
  {
    id: 'cabana',
    title: 'Cabana',
    images: [introMedia],
  },
  {
    id: 'interior',
    title: 'Interior',
    images: interiorMedia,
  },
  {
    id: 'camere',
    title: 'Camere',
    images: roomMedia,
  },
  {
    id: 'foisor',
    title: 'Foișor',
    images: outdoorFeatures.find((feature) => feature.id === 'foisor')?.images ?? [],
  },
  {
    id: 'vatra-de-foc',
    title: 'Vatră de foc',
    images:
      outdoorFeatures.find((feature) => feature.id === 'vatra-de-foc')?.images ?? [],
  },
  {
    id: 'exterior',
    title: 'Exterior și împrejurimi',
    images: [secondaryExteriorMedia],
  },
]

export const galleryGroups: GalleryGroup[] = baseGalleryGroups.filter(
  (group) => group.images.length > 0,
)
