# Aviva Nações - Church Website Project Context

## Project Overview

This is a church website for **Igreja Aviva Nações** built with React, TypeScript, Vite, and Tailwind CSS, using shadcn/ui component library.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: lucide-react
- **Routing**: react-router-dom
- **Video Player**: react-player
- **Maps**: @vis.gl/react-google-maps
- **State Management**: React Query (@tanstack/react-query)

## Project Structure

### Pages (`src/pages/`)

- **Home.tsx**: Homepage with hero section, about, events, and CTAs
- **QuemSomos.tsx**: About page (history, mission, vision, leadership, ministries)
- **NossasIgrejas.tsx**: Churches/locations page
- **Programacao.tsx**: Schedule/programming page
- **RedesSociais.tsx**: Social media page with 8 platforms
- **Projetos.tsx**: Projects page
- **Galerias.tsx**: Photo galleries page
- **Eventos.tsx**: Events page
- **Videos.tsx**: Videos page with react-player integration
- **VersiculoDoDia.tsx**: Daily Bible verse page with Facebook iframe
- **FaleConosco.tsx**: Contact page
- **Jornal.tsx**: Church newspaper page
- **NotFound.tsx**: 404 page

### Components (`src/components/`)

- **Layout.tsx**: Main layout with dual navigation system (top bar + collapsible sidebar)

## Navigation Architecture

### Primary Navigation (Top Bar)

Displayed in the header on desktop and in mobile menu:

- QUEM SOMOS (`/quem-somos`)
- NOSSAS IGREJAS (`/nossas-igrejas`)
- PROGRAMAÇÃO (`/programacao`)
- REDES SOCIAIS (`/redes-sociais`)

### Secondary Navigation (Sidebar)

Displayed in collapsible left sidebar on desktop and in mobile menu:

- HOME (`/`) - Icon: Home
- PROJETOS (`/projetos`) - Icon: FolderKanban
- FOTOS (`/galerias`) - Icon: Image
- EVENTOS (`/eventos`) - Icon: Calendar
- VÍDEOS (`/videos`) - Icon: Video
- VERSÍCULO DO DIA (`/versiculo-do-dia`) - Icon: BookOpen
- FALE CONOSCO (`/fale-conosco`) - Icon: MessageSquare
- JORNAL (`/jornal`) - Icon: Newspaper

### Mobile Navigation

- Uses shadcn/ui Sheet component (slide-in menu from right)
- Shows all primary + secondary navigation items
- Closes automatically on navigation

### Sidebar Features

- Collapsible (240px expanded / 64px collapsed)
- Icons always visible
- Labels visible only when expanded
- Sticky positioning (stays visible on scroll)
- Desktop only (hidden on mobile)

## Social Media Links

The church has 8 official social media platforms and channels:

1. **Facebook**

   - URL: `https://web.facebook.com/igrejaevangelicaaviva/`
   - Description: Daily posts, events, live broadcasts

2. **Instagram**

   - URL: `https://www.instagram.com/igrejaavivanacoes/`
   - Description: Inspirational verses, event stories, community moments

3. **Canal Aviva Nações (YouTube)**

   - URL: `https://www.youtube.com/@TvAvivaNacoes`
   - Description: Full services, sermons, worship, testimonies

4. **WebRádio**

   - URL: `https://app.mobileradio.com.br/WebRadioAvivaNacoes`
   - Description: 24/7 programming with worship, sermons, uplifting content

5. **Associação Benificiente EL Roi**

   - URL: `https://www.facebook.com/share/194jRRsrGp/`
   - Description: Social projects and community love actions

6. **Jornal Aviva News**

   - URL: `https://portaldojoan.my.canva.site/`
   - Description: News, articles, content about faith, family, society

7. **Aviva Jovens**

   - URL: `https://www.instagram.com/_aviva.jovens`
   - Description: Youth ministry with events, meetings, relevant content

8. **Spotify**
   - URL: `https://open.spotify.com/show/6UxigeE1ZivVsJxRdVokSJ`
   - Description: Playlists, sermons, worship on streaming platform

All links open in new tabs with `target="_blank"` and `rel="noopener noreferrer"` for security.

## Video Integration

### react-player Implementation

```typescript
import ReactPlayer from "react-player";

<div className="aspect-video bg-black">
  <ReactPlayer
    url="https://www.youtube.com/watch?v=VIDEO_ID"
    width="100%"
    height="100%"
    controls
    light // Shows thumbnail before loading
    playing={false}
  />
</div>;
```

### Pages with Video Players

- **Home.tsx**: Institutional video in "About" section
- **Videos.tsx**: Featured video + grid of 9 videos

### Video Hosting Strategy

- Use YouTube embeds (not direct file hosting)
- GitHub Pages/Vercel have file size limitations
- `light` mode for performance (loads thumbnail first)

## Versículo do Dia Page

### Facebook Iframe Embed

```typescript
<iframe
  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fweb.facebook.com%2Fapostolorowilson%2Fposts%2F..."
  width="100%"
  height="400"
  style={{ border: "none", overflow: "hidden" }}
  scrolling="no"
  frameBorder="0"
  allowFullScreen={true}
  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
  className="rounded-lg"
/>
```

### Page Sections

1. Hero with BookOpen icon
2. Featured daily verse with Facebook embed
3. Previous verses grid (6 cards)
4. CTA section with social media follow buttons
5. About the Bible section

## Design System

### Color Scheme

- Primary gradient: `bg-gradient-hero`
- Accent gradient: `bg-gradient-accent`
- Uses Tailwind's color system with CSS variables

### Shadows

- `shadow-soft`: Subtle shadow for cards
- `shadow-medium`: More pronounced shadow for elevated elements

### Animations

- `animate-fade-in`: Fade in animation
- `hover:-translate-y-1`: Lift effect on hover
- Smooth transitions with `transition-all`

### Typography

- Headings use gradient text: `bg-gradient-hero bg-clip-text text-transparent`
- Consistent spacing with mb-4, mb-6, mb-8

## Common Patterns

### Card Component Usage

```typescript
import { Card, CardContent } from "@/components/ui/card";

<Card className="shadow-medium">
  <CardContent className="p-8">{/* Content */}</CardContent>
</Card>;
```

### Navigation Links

```typescript
import { Link } from "react-router-dom";

<Link to="/path">
  <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all">
    Button Text
  </button>
</Link>;
```

### External Links (Social Media)

```typescript
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  className="..."
>
  Link Text
</a>
```

## Key Features

1. **Responsive Design**: Mobile-first approach, works on all devices
2. **Dark Mode Toggle**: Available in header (using localStorage)
3. **Sticky Navigation**: Header and sidebar stay visible on scroll
4. **Smooth Transitions**: All hover effects and state changes animate smoothly
5. **Accessible**: Proper semantic HTML, ARIA labels where needed
6. **Performance**: Lazy loading for videos with `light` mode

## Content Guidelines

### Placeholder Content

Many pages have placeholder text in brackets like `[Descrição do ministério]`. These should be replaced with actual church content:

- **QuemSomos.tsx**: History, mission, vision, values, leadership bios, ministry descriptions
- **NossasIgrejas.tsx**: Church locations, addresses, contact info
- **Projetos.tsx**: Social project descriptions, impact stories
- **Eventos.tsx**: Actual event details, dates, descriptions
- **Videos.tsx**: Real YouTube video URLs and metadata
- **Programacao.tsx**: Weekly schedule details

### Image Placeholders

Replace placeholder divs with actual images:

- Leadership photos in QuemSomos
- Church building photos in NossasIgrejas
- Event photos in Eventos and Galerias

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Notes

- Designed for static hosting (Vercel, GitHub Pages, Netlify)
- All assets should be optimized before deployment
- Videos hosted on YouTube (not in repo)
- Consider implementing analytics (Google Analytics, Plausible)

## Google Maps Integration

### Setup Required

1. Obtain Google Maps API Key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Configure API key restrictions for security
4. Add API key to `src/pages/NossasIgrejas.tsx`

See [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) for detailed instructions.

### Features Implemented

- Interactive map with custom pins for each church
- Click markers to highlight corresponding church card
- Automatic center calculation based on all church locations
- Direct links to Google Maps for navigation
- Mobile-friendly with gesture handling
- Color-coded pins (changes color when selected)

### Church Data Structure

```typescript
{
  id: number,
  name: string,
  neighborhood: string,
  address: string,
  city: string,
  phone: string,
  schedule: string,
  pastor: string,
  position: { lat: number, lng: number }
}
```

### How to Add Churches

1. Update the `churches` array in `src/pages/NossasIgrejas.tsx`
2. Get coordinates from Google Maps (right-click > "What's here?")
3. Add all church details
4. Map automatically recalculates center

## Photo Gallery Options

For displaying photos without hosting them:

### Recommended Solutions:

1. **Google Photos** - Free, unlimited storage, public albums
2. **Instagram Embed** - Already using `@igrejaavinanacoes`
3. **Cloudinary** - 25GB free tier, CDN, automatic optimization
4. **Imgur** - Simple, free, direct URLs

### Current Status

Pending implementation - user to decide which solution to use.

## Future Enhancements (Ideas)

1. **Content Management**: Connect to CMS like Contentful or Sanity
2. **Event Registration**: Add forms for event sign-ups
3. **Online Giving**: Integrate payment system for offerings/donations
4. **Blog System**: For articles and devotionals
5. **Sermon Archive**: Searchable database of past sermons
6. **Ministry Pages**: Individual pages for each ministry
7. **Prayer Request Form**: Collect and manage prayer requests
8. **Newsletter Signup**: Email collection and automation
9. **Multi-language Support**: i18n for Portuguese/English/Spanish
10. **Live Stream Integration**: Dedicated page for live broadcasts
11. **Photo Gallery**: Implement external photo storage solution

## Important Notes

- Keep placeholder YouTube URL (`dQw4w9WgXcQ`) until real videos are provided
- Facebook iframe URLs need to be properly encoded
- All external links should have security attributes (`target="_blank" rel="noopener noreferrer"`)
- Maintain consistent spacing and styling throughout
- Test mobile navigation thoroughly after any Layout.tsx changes

## Contact & Repository

- **Church**: Igreja Aviva Nações
- **Repository**: [Add repository URL]
- **Primary Developer**: [Add name]

---

**Last Updated**: 2025-11-12
**Version**: 1.0
