# Blushy Girl Portfolio

A modern, interactive portfolio website built with Next.js, featuring a music player, hangman game, and beautiful animations.

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main landing page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MusicPlayer.tsx   # Music player component
│   ├── HangmanGame.tsx   # Hangman game component
│   ├── PhotoGallery.tsx  # Photo gallery component
│   └── ui/               # shadcn/ui components
├── data/                 # Static data files
│   ├── songs.ts         # Music library data
│   ├── projects.ts      # Portfolio projects
│   ├── skills.ts        # Skills and technologies
│   └── gallery.ts       # Photo albums data
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared types
├── hooks/              # Custom React hooks
│   └── use-toast.ts
├── lib/                # Utility functions
│   └── utils.ts
└── public/             # Static assets
    ├── *.mp3          # Music files
    └── *.jpg          # Images
```

## Features

- Interactive music player with 6 songs
- Hangman word guessing game
- Photo gallery with collage layout and lightbox
- Smooth scroll animations
- Dark/light mode toggle
- Responsive design
- Beautiful gradient backgrounds
- Project showcase carousel
- Skills showcase
- Contact section

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Build

Create a production build:

```bash
npm run build
```

## Technologies

- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## License

This project is open source and available under the MIT License.
