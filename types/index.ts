export interface Song {
  title: string
  src: string
}

export interface Project {
  title: string
  description: string
  tech: string[]
  image: string
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface Photo {
  src: string
  alt: string
}

export interface PhotoAlbum {
  id: string
  title: string
  description: string
  photos: Photo[]
}
