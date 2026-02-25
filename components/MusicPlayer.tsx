'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, SkipBack, SkipForward, Music2, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface MusicPlayerProps {
  isDarkMode?: boolean
}

const songs = [
  {
    title: 'Husn',
    src: '/Husn_-_Djjohal.fm.mp3',
    lyrics: `Teri husn ki tareef karun\nYa apni kismat ki?\nDono hi meri nazar mein\nKhuda ki ibadat si\n\nTere husn ki tareef karun\nYa apni kismat ki?\nDono hi meri nazar mein\nKhuda ki ibadat si\n\nMein kaise keh doon?\nMein kya keh doon?\nKaise bayan karun?\nKya bayan karun?\n\nTu hai bada khushnaseeb\nJo tujhko mil gayi hoon\nJo tere liye bani hoon\nTere liye saji hoon`
  },
  {
    title: 'Maruvarthai',
    src: '/Maru_Varthai_Pesathey_-_Sid_Sriram_(1).mp3',
    lyrics: `Maruvaarthai pesathe\nManaivi sirippale\nAruvaarthai pesathe\nArugile varugaiyil\n\nKalai neram vaaitha\nVelai neram kaaitha\nNilavu paarthu konde\nNinaivugal serthu konde\n\nMaruvaarthai pesathe\nManaivi sirippale\nAruvaarthai pesathe\nArugile varugaiyil`
  },
  {
    title: 'Jeena Jeena',
    src: '/Jeena_Jeena_Badlapur-(Mr-Jat.in)_(1).mp3',
    lyrics: `Jeena jeena, jeena jeena\nKaise jeena, jeena jeena\nKaise jeena tere bin ab jeena\n\nKya khabar kya pata kis din se\nKya khabar kya pata kis kshan se\nJo tujhe dekha toh yeh jaana sanam\nPyar hota hai deewana sanam\n\nTere bin ab na lenge ik bhi dum\nTujhe kitna chahne lage hum\n\nJeena jeena, jeena jeena\nKaise jeena, jeena jeena`
  },
  {
    title: 'Kinavu Kondu',
    src: '/Kinavu_Kondu.mp3',
    lyrics: `Kinavu kondu vanthen\nNee thaanae kaNdi pidithen\nUnai aNaithu kondiruntha en manasu\nUyir endru solluthae\n\nKaNgaL kooda maRaipathu etharku?\nUllamae kooda maraipathu etharku?\n\nKaNNae nee vendum endru sonnathadi\nKaNdu naan konden unai\nVaaN nee vendum endru sonnathadi\nVaNduvinai seiduvithennai`
  }
]

export default function MusicPlayer({ isDarkMode = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setShowLyrics(false)}
      >
        <Card
          className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-rose-200'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`sticky top-0 z-10 flex items-center justify-between p-6 backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/90 border-b border-white/10' : 'bg-white/90 border-b border-rose-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-cyan-400 to-teal-400' : 'bg-gradient-to-br from-rose-400 to-pink-400'}`}>
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {songs[currentSongIndex].title}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Song Lyrics
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowLyrics(false)}
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-rose-100 text-slate-900'}`}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-8 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className={`text-center space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`}>
              {songs[currentSongIndex].lyrics.split('\n').map((line, index) => (
                <p
                  key={index}
                  className={`text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-2 ${line.trim() === '' ? 'h-4' : ''}`}
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                >
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          </div>

          <div className={`sticky bottom-0 p-4 backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/90 border-t border-white/10' : 'bg-white/90 border-t border-rose-200'}`}>
            <div className="flex items-center gap-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playPrevious()
                }}
                size="sm"
                className={`rounded-full ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-200 hover:bg-rose-300'}`}
              >
                <SkipBack className={`h-4 w-4 ${isDarkMode ? 'text-cyan-400' : 'text-rose-700'}`} />
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlayPause()
                }}
                size="sm"
                className={`rounded-full shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'}`}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" fill="white" />
                ) : (
                  <Play className="h-4 w-4" fill="white" />
                )}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playNext()
                }}
                size="sm"
                className={`rounded-full ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-200 hover:bg-rose-300'}`}
              >
                <SkipForward className={`h-4 w-4 ${isDarkMode ? 'text-cyan-400' : 'text-rose-700'}`} />
              </Button>

              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />
                <div className={`flex justify-between text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )}
    </>
  )
}
