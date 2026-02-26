'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, SkipBack, SkipForward, Music2, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { songs } from '@/data/songs'

interface MusicPlayerProps {
  isDarkMode?: boolean
}

export default function MusicPlayer({ isDarkMode = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [showLibrary, setShowLibrary] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songs[currentSongIndex]

  // Base audio listeners: time + duration + ended
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)

    const handleEnded = () => {
      setIsPlaying(false)
      playNext()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('durationchange', updateDuration)
    audio.addEventListener('ended', handleEnded)

    // try autoplay on song change
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('durationchange', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex])

  // Volume updates
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume / 100
  }, [volume])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const playNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length)
    setCurrentTime(0)
  }

  const playPrevious = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length)
    setCurrentTime(0)
  }

  const selectSong = (index: number) => {
    setCurrentSongIndex(index)
    setCurrentTime(0)
    setShowLibrary(false)
  }

  return (
    <>
      <Card
        className={`p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'
        }`}
        onClick={() => setShowLibrary(true)}
      >
        <audio ref={audioRef} src={currentSong.src} preload="metadata" />

        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-br from-cyan-400 to-teal-400'
                : 'bg-gradient-to-br from-rose-400 to-pink-400'
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div
                className={`w-4 h-4 rounded-full ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-cyan-400 to-teal-400'
                    : 'bg-gradient-to-br from-rose-400 to-pink-400'
                }`}
              />
            </div>
          </div>

          <div className="flex-1">
            <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentSong.title}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Now Playing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
            <div className={`flex justify-between text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playPrevious()
                }}
                size="lg"
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-200 hover:bg-rose-300'
                }`}
              >
                <SkipBack className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-700'}`} />
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlayPause()
                }}
                size="lg"
                className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                }`}
              >
                {isPlaying ? <Pause className="h-6 w-6" fill="white" /> : <Play className="h-6 w-6" fill="white" />}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playNext()
                }}
                size="lg"
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-200 hover:bg-rose-300'
                }`}
              >
                <SkipForward className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-700'}`} />
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
              <Volume2 className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-500'}`} />
              <Slider value={[volume]} max={100} step={1} onValueChange={(value) => setVolume(value[0])} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </Card>

      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowLibrary(false)}>
          <div className="h-full w-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div
              className={`flex items-center justify-between p-4 sm:p-6 backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-900/50 border-b border-white/10' : 'bg-white/10 border-b border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-cyan-400 to-teal-400'
                      : 'bg-gradient-to-br from-rose-400 to-pink-400'
                  }`}
                >
                  <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Music Library</h2>
                  <p className="text-xs sm:text-sm text-gray-400">{songs.length} songs</p>
                </div>
              </div>

              <Button
                onClick={() => setShowLibrary(false)}
                variant="ghost"
                size="icon"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="max-w-2xl mx-auto space-y-2 sm:space-y-3">
                {songs.map((song, index) => (
                  <button
                    key={index}
                    onClick={() => selectSong(index)}
                    className={`w-full p-4 sm:p-5 rounded-xl backdrop-blur-sm transition-all duration-300 text-left hover:scale-[1.02] ${
                      index === currentSongIndex
                        ? isDarkMode
                          ? 'bg-cyan-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                          : 'bg-rose-500/20 border-2 border-rose-400/50 shadow-lg shadow-rose-500/20'
                        : isDarkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center shadow-md ${
                          index === currentSongIndex
                            ? isDarkMode
                              ? 'bg-gradient-to-br from-cyan-400 to-teal-400'
                              : 'bg-gradient-to-br from-rose-400 to-pink-400'
                            : isDarkMode
                            ? 'bg-slate-700'
                            : 'bg-white/20'
                        }`}
                      >
                        {index === currentSongIndex && isPlaying ? (
                          <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                        ) : (
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold text-base sm:text-lg truncate ${
                            index === currentSongIndex
                              ? isDarkMode
                                ? 'text-cyan-400'
                                : 'text-rose-400'
                              : 'text-white'
                          }`}
                        >
                          {song.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {index === currentSongIndex ? 'Now Playing' : 'Tap to play'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
