'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, SkipBack, SkipForward, Music2, X, Sparkles } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface MusicPlayerProps {
  isDarkMode?: boolean
}

interface LyricLine {
  time: number
  text: string
}

type Song = {
  title: string
  src: string
  lyricOffset?: number
  lyrics: LyricLine[]
}

const maruvarthaiLyrics: LyricLine[] = [
  { time: 0, text: 'Maruvarthai pesathe' },
  { time: 0, text: 'Madimeedhu nee thoongidu' },
  { time: 0, text: 'Imai pola naankaakha Kanavai nee maridu' },
  { time: 0, text: 'Maayilthogai pollea Viral unnai varudhum' },
  { time: 0, text: 'Manappadamai uraiyadal nigazhum' },
  { time: 0, text: '' },

  { time: 0, text: 'Vizhi neerum veen aaga' },
  { time: 0, text: 'Imaithaanda koodathena' },
  { time: 0, text: 'Thuliyaga naan searthen' },
  { time: 0, text: 'Kadalaaga kannaanathey' },
  { time: 0, text: 'Maranthalum naan unnai' },
  { time: 0, text: 'Ninaikkatha naal illaye' },
  { time: 0, text: 'Pirinthalum yean anbu' },
  { time: 0, text: 'Orupothum poi illaiye' },
  { time: 0, text: '' },

  { time: 0, text: 'Vidiyatha kaalaigal' },
  { time: 0, text: 'Mudiyaadha maalaigalil' },
  { time: 0, text: 'Vadiyatha vearvai thuligal' },
  { time: 0, text: 'Piriyatha porvai nodigal' },
  { time: 0, text: 'Manikaattum kadigaram' },
  { time: 0, text: 'Tharumvaadhai arinththom' },
  { time: 0, text: 'Udaimaattrum idaivealai' },
  { time: 0, text: 'Athan pinbe unarthom' },
  { time: 0, text: 'Maravathe manam' },
  { time: 0, text: 'Madinthaalum varum' },
  { time: 0, text: 'Muthal nee, mudivum nee' },
  { time: 0, text: 'Alar nee, agilam nee' },
  { time: 0, text: '' },

  { time: 0, text: 'Tholaithooram seandraalum' },
  { time: 0, text: 'Thoduvaanam endralum nee' },
  { time: 0, text: 'Vizhiyoram thaenea, marainthaai' },
  { time: 0, text: 'Uyirodu munbe kalanthai' },
  { time: 0, text: 'Ithal ennum malar kondu' },
  { time: 0, text: 'Kadithangal varainthai' },
  { time: 0, text: 'Bathil naanum tharum munbe' },
  { time: 0, text: 'Kanavagi kalainthai' },
  { time: 0, text: 'Pidivaatham pidi' },
  { time: 0, text: 'Sinam thearum adi' },
  { time: 0, text: 'Izhanthom, ezhukolam Inimel mazhaikaalam' },
  { time: 0, text: '' },

  { time: 0, text: 'Maruvarthai pesathe' },
  { time: 0, text: 'Madimeedhu nee thungidu' },
  { time: 0, text: 'Imai pola naankaakha Kanava nee maridu' },
  { time: 0, text: 'Mayil thogai polle Viral unnai varudum' },
  { time: 0, text: 'Manappadamai uraiyadal nigazhum' },
  { time: 0, text: '' },

  { time: 0, text: 'Vizhi neerum veen aaga' },
  { time: 0, text: 'Imaithaanda koodathena' },
  { time: 0, text: 'Thuliyaga naan searthen' },
  { time: 0, text: 'Kadalaaga kannaanathe' },
  { time: 0, text: 'Maranthalum naan unnai' },
  { time: 0, text: 'Ninaikkatha naal illaye' },
  { time: 0, text: 'Pirinthalum yen anbu' },
  { time: 0, text: '' },

  { time: 0, text: 'Orupothum poi illaiye' },
  { time: 0, text: 'Maruvaarthai pesathe' },
  { time: 0, text: 'Madimeedhu nee thungidu' },
]

const songs: Song[] = [
  {
    title: 'Husn',
    src: '/Husn_-_Djjohal.fm.mp3',
    lyricOffset: 0, // tweak per file if needed
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
    ],
  },
  {
    title: 'Maruvarthai',
    src: '/Maru_Varthai_Pesathey_-_Sid_Sriram_(1).mp3',
    lyricOffset: 0, // you will set this after timing if needed
    lyrics: maruvarthaiLyrics,
  },
  {
    title: 'Jeena Jeena',
    src: '/Jeena_Jeena_Badlapur-(Mr-Jat.in)_(1).mp3',
    lyricOffset: 0,
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
    ],
  },
  {
    title: 'Kinavu Kondu',
    src: '/Kinavu_Kondu.mp3',
    lyricOffset: 0,
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
    ],
  },
]

export default function MusicPlayer({ isDarkMode = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [showLibrary, setShowLibrary] = useState(false)
  const [showDisco, setShowDisco] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

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

  const setupAudioAnalyser = () => {
    const audio = audioRef.current
    if (!audio || audioContextRef.current) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audio)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    source.connect(analyser)
    analyser.connect(audioContext.destination)

    audioContextRef.current = audioContext
    analyserRef.current = analyser
    dataArrayRef.current = dataArray
  }

  const drawDisco = () => {
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current

    if (!canvas || !analyser || !dataArray) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const WIDTH = canvas.width
    const HEIGHT = canvas.height
    const bufferLength = analyser.frequencyBinCount

    analyser.getByteFrequencyData(dataArray)

    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    const barWidth = (WIDTH / bufferLength) * 2.5
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * HEIGHT * 0.8

      const hue = (i / bufferLength) * 360
      const saturation = 100
      const lightness = 50 + (dataArray[i] / 255) * 30

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

      ctx.shadowBlur = 20
      ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`

      const circleX = x + barWidth / 2
      const circleY = HEIGHT / 2
      const radius = (dataArray[i] / 255) * 50

      ctx.beginPath()
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2)
      ctx.fill()

      x += barWidth + 1
    }

    ctx.shadowBlur = 0

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(currentSong.title, WIDTH / 2, HEIGHT / 2)

    animationFrameRef.current = requestAnimationFrame(drawDisco)
  }

  useEffect(() => {
    if (showDisco) {
      if (!audioContextRef.current) {
        setupAudioAnalyser()
      }
      drawDisco()
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDisco])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

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

          <Button
            onClick={(e) => {
              e.stopPropagation()
              setShowDisco(true)
            }}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 rounded-full transition-all duration-300 ${
              isDarkMode ? 'hover:bg-cyan-500/20 text-cyan-400' : 'hover:bg-rose-200 text-rose-600'
            }`}
          >
            <Sparkles className="h-5 w-5" />
          </Button>
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

      {showDisco && (
        <div className="fixed inset-0 z-50 bg-black" onClick={() => setShowDisco(false)}>
          <canvas ref={canvasRef} className="w-full h-full" />
          <Button
            onClick={() => setShowDisco(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-4 rounded-full">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                playPrevious()
              }}
              size="sm"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
            >
              <SkipBack className="h-5 w-5 text-white" />
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation()
                togglePlayPause()
              }}
              size="lg"
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              {isPlaying ? <Pause className="h-6 w-6" fill="white" /> : <Play className="h-6 w-6" fill="white" />}
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation()
                playNext()
              }}
              size="sm"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
            >
              <SkipForward className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      )}

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