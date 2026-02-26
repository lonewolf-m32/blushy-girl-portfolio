'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { X, ZoomIn, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { photoAlbums } from '@/data/gallery'
import Image from 'next/image'

interface PhotoGalleryProps {
  isDarkMode?: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function PhotoGallery({ isDarkMode = false }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const album = photoAlbums[0]

  const placeholderCount = 6
  const totalCards = album.photos.length + placeholderCount

  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)
    }
  }, [selectedPhotoIndex])

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedPhotoIndex !== null && selectedPhotoIndex < album.photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedPhotoIndex === null) return

    if (e.key === 'ArrowLeft' && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    } else if (e.key === 'ArrowRight' && selectedPhotoIndex < album.photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    } else if (e.key === 'Escape') {
      setSelectedPhotoIndex(null)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhotoIndex])

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {album.photos.map((photo, index) => (
            <Card
              key={`photo-${index}`}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:z-10 ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'
              }`}
              onClick={() => setSelectedPhotoIndex(index)}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className={`p-3 rounded-full backdrop-blur-sm ${
                      isDarkMode ? 'bg-cyan-500/30' : 'bg-rose-500/30'
                    }`}
                  >
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'border-cyan-400/50' : 'border-rose-400/50'}`}></div>
              </div>
            </Card>
          ))}

          {Array.from({ length: placeholderCount }).map((_, index) => (
            <Card
              key={`placeholder-${index}`}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:z-10 ${
                isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-200'
              }`}
            >
              <div className="relative aspect-square overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className={`text-center transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-700/50' : 'bg-white/50'}`}>
                      <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium">Add Photo</p>
                  </div>
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/30 via-transparent to-teal-500/30' : 'bg-gradient-to-br from-rose-500/30 via-transparent to-pink-500/30'}`}></div>
                <div className={`absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'border-cyan-400/50' : 'border-rose-400/50'}`}></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full pointer-events-none ${
                isDarkMode ? 'bg-cyan-400' : 'bg-rose-400'
              }`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                opacity: 0.6,
                boxShadow: `0 0 ${particle.size * 4}px ${isDarkMode ? 'rgba(34, 211, 238, 0.8)' : 'rgba(244, 63, 94, 0.8)'}`,
              }}
            />
          ))}

          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {selectedPhotoIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 z-10"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {selectedPhotoIndex < album.photos.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 z-10"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={album.photos[selectedPhotoIndex].src}
                alt={album.photos[selectedPhotoIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {album.photos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPhotoIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedPhotoIndex
                    ? `w-8 ${isDarkMode ? 'bg-cyan-400' : 'bg-rose-400'}`
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.6;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
            opacity: 1;
          }
          75% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  )
}
