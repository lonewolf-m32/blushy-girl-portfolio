'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { X, ZoomIn } from 'lucide-react'
import { photoAlbums } from '@/data/gallery'
import Image from 'next/image'

interface PhotoGalleryProps {
  isDarkMode?: boolean
}

export default function PhotoGallery({ isDarkMode = false }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const album = photoAlbums[0]

  return (
    <>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {album.title}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            {album.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {album.photos.map((photo, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'
              } ${index === 0 ? 'md:row-span-2' : ''}`}
              onClick={() => setSelectedPhoto(photo.src)}
            >
              <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className={`p-3 rounded-full backdrop-blur-sm ${
                      isDarkMode ? 'bg-cyan-500/30' : 'bg-rose-500/30'
                    }`}
                  >
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedPhoto}
              alt="Full size photo"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
