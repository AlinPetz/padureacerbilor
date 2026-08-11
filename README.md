# Pădurea Cerbilor

Site cu o singură pagină, în limba română, pentru cabana A-frame Pădurea Cerbilor.

## Dezvoltare

```bash
npm install
npm run dev
npm run build
```

Conținutul proprietății, navigația, media, facilitățile și metadatele sunt
centralizate în `src/data/siteContent.ts`.

## Media

Fișierele originale rămân în folderul de lucru al proprietății. Copiile folosite
de site sunt în `public/media/`, redenumite descriptiv și convertite în WebP unde
este cazul.

## Actualizări ulterioare

Pentru a adăuga fotografii noi:

1. Salvați copia optimizată în subfolderul potrivit din `public/media/`.
2. Adăugați elementul în `src/data/siteContent.ts`.
3. Actualizați `MEDIA_MANIFEST.md` cu fișierul original, categoria, secțiunea și textul
   alternativ.

Pentru date de contact, prețuri, reguli, localizare sau dotări noi, completați
mai întâi `src/data/siteContent.ts` și publicați doar informații confirmate.
