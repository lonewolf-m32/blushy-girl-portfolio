'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, SkipBack, SkipForward, Music2, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface MusicPlayerProps {
  isDarkMode?: boolean
}

interface LyricLine {
  time: number
  text: string
}

const songs = [
  {
    title: 'Husn',
    src: '/Husn_-_Djjohal.fm.mp3',
    lyrics: [
      { time: 0, text: 'Teri husn ki tareef karun' },
      { time: 4, text: 'Ya apni kismat ki?' },
      { time: 8, text: 'Dono hi meri nazar mein' },
      { time: 12, text: 'Khuda ki ibadat si' },
      { time: 16, text: '' },
      { time: 17, text: 'Tere husn ki tareef karun' },
      { time: 21, text: 'Ya apni kismat ki?' },
      { time: 25, text: 'Dono hi meri nazar mein' },
      { time: 29, text: 'Khuda ki ibadat si' },
      { time: 33, text: '' },
      { time: 34, text: 'Mein kaise keh doon?' },
      { time: 38, text: 'Mein kya keh doon?' },
      { time: 42, text: 'Kaise bayan karun?' },
      { time: 46, text: 'Kya bayan karun?' },
      { time: 50, text: '' },
      { time: 51, text: 'Tu hai bada khushnaseeb' },
      { time: 55, text: 'Jo tujhko mil gayi hoon' },
      { time: 59, text: 'Jo tere liye bani hoon' },
      { time: 63, text: 'Tere liye saji hoon' },
    ]
  },
  {
    title: 'Maruvarthai',
    src: '/Maru_Varthai_Pesathey_-_Sid_Sriram_(1).mp3',
    lyrics: [
      { time: 0, text: 'Maruvaarthai pesathe' },
      { time: 4, text: 'Manaivi sirippale' },
      { time: 8, text: 'Aruvaarthai pesathe' },
      { time: 12, text: 'Arugile varugaiyil' },
      { time: 16, text: '' },
      { time: 17, text: 'Kalai neram vaaitha' },
      { time: 21, text: 'Velai neram kaaitha' },
      { time: 25, text: 'Nilavu paarthu konde' },
      { time: 29, text: 'Ninaivugal serthu konde' },
      { time: 33, text: '' },
      { time: 34, text: 'Maruvaarthai pesathe' },
      { time: 38, text: 'Manaivi sirippale' },
      { time: 42, text: 'Aruvaarthai pesathe' },
      { time: 46, text: 'Arugile varugaiyil' },
    ]
  },
  {
    title: 'Jeena Jeena',
    src: '/Jeena_Jeena_Badlapur-(Mr-Jat.in)_(1).mp3',
    lyrics: [
      { time: 0, text: 'Jeena jeena, jeena jeena' },
      { time: 4, text: 'Kaise jeena, jeena jeena' },
      { time: 8, text: 'Kaise jeena tere bin ab jeena' },
      { time: 12, text: '' },
      { time: 13, text: 'Kya khabar kya pata kis din se' },
      { time: 17, text: 'Kya khabar kya pata kis kshan se' },
      { time: 21, text: 'Jo tujhe dekha toh yeh jaana sanam' },
      { time: 25, text: 'Pyar hota hai deewana sanam' },
      { time: 29, text: '' },
      { time: 30, text: 'Tere bin ab na lenge ik bhi dum' },
      { time: 34, text: 'Tujhe kitna chahne lage hum' },
      { time: 38, text: '' },
      { time: 39, text: 'Jeena jeena, jeena jeena' },
      { time: 43, text: 'Kaise jeena, jeena jeena' },
    ]
  },
  {
    title: 'Kinavu Kondu',
    src: '/Kinavu_Kondu.mp3',
    lyrics: [
      { time: 0, text: 'Kinavu kondu vanthen' },
      { time: 4, text: 'Nee thaanae kaNdi pidithen' },
      { time: 8, text: 'Unai aNaithu kondiruntha en manasu' },
      { time: 12, text: 'Uyir endru solluthae' },
      { time: 16, text: '' },
      { time: 17, text: 'KaNgaL kooda maRaipathu etharku?' },
      { time: 21, text: 'Ullamae kooda maraipathu etharku?' },
      { time: 25, text: '' },
      { time: 26, text: 'KaNNae nee vendum endru sonnathadi' },
      { time: 30, text: 'KaNdu naan konden unai' },
      { time: 34, text: 'VaaN nee vendum endru sonnathadi' },
      { time: 38, text: 'VaNduvinai seiduvithennai' },
    ]
  }
]

export default function MusicPlayer({ isDarkMode = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      playNext()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      setIsPlaying(false)
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    const lyrics = songs[currentSongIndex].lyrics
    const currentIndex = lyrics.findLastIndex(line => line.time <= currentTime)
    if (currentIndex !== -1 && currentIndex !== currentLyricIndex) {
      setCurrentLyricIndex(currentIndex)

      if (lyricsContainerRef.current && showLyrics) {
        const activeLine = lyricsContainerRef.current.children[currentIndex] as HTMLElement
        if (activeLine) {
          activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }, [currentTime, currentSongIndex, showLyrics])

  useEffect(() => {
    setCurrentLyricIndex(0)
  }, [currentSongIndex])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
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

  return (
    <>
      <Card
        className={`p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'}`}
        onClick={() => setShowLyrics(true)}
      >
        <audio ref={audioRef} src={songs[currentSongIndex].src} />

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-cyan-400 to-teal-400' : 'bg-gradient-to-br from-rose-400 to-pink-400'}`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`w-4 h-4 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-cyan-400 to-teal-400' : 'bg-gradient-to-br from-rose-400 to-pink-400'}`}></div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{songs[currentSongIndex].title}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Now Playing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className={`flex justify-between text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={playPrevious}
              size="lg"
              className={`w-10 h-10 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-200 hover:bg-rose-300'}`}
            >
              <SkipBack className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-700'}`} />
            </Button>

            <Button
              onClick={togglePlayPause}
              size="lg"
              className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'}`}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" fill="white" />
              ) : (
                <Play className="h-6 w-6" fill="white" />
              )}
            </Button>

            <Button
              onClick={playNext}
              size="lg"
              className={`w-10 h-10 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-200 hover:bg-rose-300'}`}
            >
              <SkipForward className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-700'}`} />
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <Volume2 className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-500'}`} />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </Card>

    {showLyrics && (
      <div
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={() => setShowLyrics(false)}
      >
        <div
          className="h-full w-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center justify-between p-6 backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/50 border-b border-white/10' : 'bg-white/10 border-b border-white/20'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-cyan-400 to-teal-400' : 'bg-gradient-to-br from-rose-400 to-pink-400'}`}>
                <Music2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {songs[currentSongIndex].title}
                </h2>
                <p className="text-sm text-gray-400">
                  Song Lyrics
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowLyrics(false)}
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full hover:bg-white/10 text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div
            ref={lyricsContainerRef}
            className="flex-1 overflow-y-auto px-8 py-16 flex items-center justify-center"
          >
            <div className="max-w-4xl w-full space-y-8">
              {songs[currentSongIndex].lyrics.map((line, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-500 ${
                    line.text.trim() === '' ? 'h-8' : ''
                  }`}
                >
                  {line.text && (
                    <p
                      className={`text-3xl md:text-4xl lg:text-5xl font-semibold leading-relaxed transition-all duration-500 ${
                        index === currentLyricIndex
                          ? isDarkMode
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 scale-110 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 scale-110 drop-shadow-[0_0_30px_rgba(251,113,133,0.5)]'
                          : index < currentLyricIndex
                          ? 'text-gray-600 scale-95 opacity-40'
                          : 'text-gray-500 scale-90 opacity-30'
                      }`}
                    >
                      {line.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/50 border-t border-white/10' : 'bg-white/10 border-t border-white/20'}`}>
            <div className="max-w-4xl mx-auto flex items-center gap-6">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playPrevious()
                }}
                size="lg"
                className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-500/20 hover:bg-rose-500/30'}`}
              >
                <SkipBack className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-400'}`} />
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlayPause()
                }}
                size="lg"
                className={`w-16 h-16 rounded-full shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'}`}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" fill="white" />
                ) : (
                  <Play className="h-6 w-6" fill="white" />
                )}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playNext()
                }}
                size="lg"
                className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-500/20 hover:bg-rose-500/30'}`}
              >
                <SkipForward className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-400'}`} />
              </Button>

              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs mt-2 text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
