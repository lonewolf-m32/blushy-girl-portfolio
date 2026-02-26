'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { X, ZoomIn, ChevronLeft, ChevronRight, Images } from 'lucide-react'
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
  const [isOpen, setIsOpen] = useState(false)
  const album = photoAlbums[0]

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen])

  const openGallery = () => {
    setIsOpen(true)
    setSelectedPhotoIndex(0)
  }

  const closeGallery = () => {
    setIsOpen(false)
    setSelectedPhotoIndex(null)
  }

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
    if (!isOpen) return

    if (e.key === 'ArrowLeft' && selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    } else if (e.key === 'ArrowRight' && selectedPhotoIndex !== null && selectedPhotoIndex < album.photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    } else if (e.key === 'Escape') {
      closeGallery()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedPhotoIndex])

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

        <div className="flex justify-center">
          <Card
            className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] w-full max-w-4xl ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'
            }`}
            onClick={openGallery}
          >
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <div className="grid grid-cols-2 gap-2 h-full p-2">
                {album.photos.slice(0, 2).map((photo, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className={`px-6 py-3 rounded-full backdrop-blur-sm flex items-center gap-2 ${
                    isDarkMode ? 'bg-cyan-500/30' : 'bg-rose-500/30'
                  }`}
                >
                  <Images className="w-6 h-6 text-white" />
                  <span className="text-white font-semibold">View Gallery ({album.photos.length} photos)</span>
                </div>
              </div>

              <div className={`absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-lg ${isDarkMode ? 'border-cyan-400/50' : 'border-rose-400/50'}`}></div>

              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'}`}>
                <span className={`text-sm font-semibold flex items-center gap-1 ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`}>
                  <Images className="w-4 h-4" />
                  {album.photos.length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isOpen && selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 flex items-center justify-center p-4"
          onClick={closeGallery}
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
            onClick={closeGallery}
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

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
              <span className="text-white font-semibold text-sm">
                {selectedPhotoIndex + 1} / {album.photos.length}
              </span>
            </div>
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
