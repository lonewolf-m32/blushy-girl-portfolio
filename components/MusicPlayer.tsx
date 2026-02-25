'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2, SkipBack, SkipForward, Music2, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface MusicPlayerProps {
  isDarkMode?: boolean
}

interface LyricLine {
  time: number // start time (seconds)
  text: string
}

type LyricCue = { start: number; end: number; text: string; isGap: boolean }

type Song = {
  title: string
  src: string
  lyricOffset?: number // seconds: + highlights earlier/later depending on your file
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

// ---------- helpers ----------
function toCues(lines: LyricLine[], durationFallback: number): LyricCue[] {
  const sorted = [...lines].sort((a, b) => a.time - b.time)
  return sorted.map((l, i) => {
    const nextStart = sorted[i + 1]?.time ?? durationFallback
    return {
      start: l.time,
      end: Math.max(l.time, nextStart),
      text: l.text,
      isGap: l.text.trim() === '',
    }
  })
}

function findCueIndex(cues: LyricCue[], t: number) {
  let lo = 0
  let hi = cues.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const c = cues[mid]
    if (t < c.start) hi = mid - 1
    else if (t >= c.end) lo = mid + 1
    else return mid
  }
  return Math.max(0, Math.min(cues.length - 1, lo - 1))
}

function normalizeTimedLyrics(lines: LyricLine[]) {
  // remove impossible times, keep order stable, and ensure monotonic times
  const cleaned = lines.map((l) => ({
    time: Number.isFinite(l.time) && l.time >= 0 ? l.time : 0,
    text: l.text,
  }))

  // enforce non-decreasing
  for (let i = 1; i < cleaned.length; i++) {
    if (cleaned[i].time < cleaned[i - 1].time) cleaned[i].time = cleaned[i - 1].time
  }
  return cleaned
}

export default function MusicPlayer({ isDarkMode = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [showLyrics, setShowLyrics] = useState(false)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)

  // Timing mode (tap-to-time)
  const [isTimingMode, setIsTimingMode] = useState(false)
  const [timingIndex, setTimingIndex] = useState(0)
  const [timedLyrics, setTimedLyrics] = useState<LyricLine[]>(() => songs[0].lyrics)

  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsContainerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  // Smooth highlight feel
  const LOOKAHEAD = 0.06

  const currentSong = songs[currentSongIndex]
  const lyricOffset = currentSong.lyricOffset ?? 0

  // When song changes, reset timing mode state
  useEffect(() => {
    setCurrentLyricIndex(0)
    setIsTimingMode(false)
    setTimingIndex(0)
    // start with zeroed timings so you can stamp cleanly
    setTimedLyrics(currentSong.lyrics.map((l) => ({ ...l, time: 0 })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex])

  const activeLyrics: LyricLine[] = isTimingMode ? timedLyrics : currentSong.lyrics

  const cues = useMemo(() => {
    const fallback = duration > 0 ? duration : 9999
    return toCues(activeLyrics, fallback)
  }, [activeLyrics, duration])

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

  // RAF-driven lyric highlighting (smooth + accurate)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    const tick = () => {
      const t = audio.currentTime + lyricOffset + LOOKAHEAD
      if (cues.length) {
        const idx = findCueIndex(cues, t)
        if (idx !== currentLyricIndex) {
          setCurrentLyricIndex(idx)

          if (showLyrics && lyricsContainerRef.current && !cues[idx]?.isGap) {
            const container = lyricsContainerRef.current
            const el = container.querySelector(`[data-lyric-index="${idx}"]`) as HTMLElement | null

            if (el) {
              const containerHeight = container.clientHeight
              const elementTop = el.offsetTop
              const elementHeight = el.clientHeight
              const scrollPosition = elementTop - (containerHeight / 2) + (elementHeight / 2)

              container.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
              })
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const onPlay = () => {
      stop()
      rafRef.current = requestAnimationFrame(tick)
    }
    const onPause = () => stop()
    const onSeeked = () => {
      stop()
      rafRef.current = requestAnimationFrame(tick)
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('seeked', onSeeked)

    if (!audio.paused) onPlay()

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('seeked', onSeeked)
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cues, showLyrics, currentLyricIndex, lyricOffset])

  // Timing mode: stamp next line (button or Space)
  const stampNextLine = () => {
    const audio = audioRef.current
    if (!audio) return
    setTimedLyrics((prev) => {
      if (timingIndex >= prev.length) return prev
      const next = [...prev]
      next[timingIndex] = { ...next[timingIndex], time: Number(audio.currentTime.toFixed(2)) }
      return next
    })
    setTimingIndex((i) => i + 1)
  }

  // Spacebar stamps in timing mode
  useEffect(() => {
    if (!isTimingMode) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        stampNextLine()
      }
      // quick undo
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        setTimingIndex((i) => Math.max(0, i - 1))
        setTimedLyrics((prev) => {
          const next = [...prev]
          const idx = Math.max(0, timingIndex - 1)
          if (next[idx]) next[idx] = { ...next[idx], time: 0 }
          return next
        })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimingMode, timingIndex])

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

  const copyTimingJson = async () => {
    const payload = JSON.stringify(normalizeTimedLyrics(timedLyrics), null, 2)
    await navigator.clipboard.writeText(payload)
  }

  return (
    <>
      <Card
        className={`p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/90 border-rose-200'
        }`}
        onClick={() => setShowLyrics(true)}
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
            <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
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

            <div className="flex items-center gap-2 flex-1">
              <Volume2 className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-500'}`} />
              <Slider value={[volume]} max={100} step={1} onValueChange={(value) => setVolume(value[0])} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </Card>

      {showLyrics && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowLyrics(false)}>
          <div className="h-full w-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div
              className={`flex items-center justify-between p-6 backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-900/50 border-b border-white/10' : 'bg-white/10 border-b border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-cyan-400 to-teal-400'
                      : 'bg-gradient-to-br from-rose-400 to-pink-400'
                  }`}
                >
                  <Music2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{currentSong.title}</h2>
                  <p className="text-sm text-gray-400">
                    {isTimingMode ? 'Timing Mode (Space = stamp, Ctrl+Z = undo)' : 'Song Lyrics'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsTimingMode((v) => !v)
                    setTimingIndex(0)
                    setTimedLyrics(currentSong.lyrics.map((l) => ({ ...l, time: 0 })))
                  }}
                >
                  {isTimingMode ? 'Exit Timing' : 'Timing Mode'}
                </Button>

                {isTimingMode && (
                  <>
                    <Button onClick={stampNextLine}>Stamp Next</Button>
                    <Button variant="ghost" onClick={copyTimingJson} className="text-white hover:bg-white/10">
                      Copy JSON
                    </Button>
                    <div className="text-xs text-gray-400">
                      {Math.min(timingIndex + 1, timedLyrics.length)}/{timedLyrics.length}
                    </div>
                  </>
                )}

                <Button
                  onClick={() => setShowLyrics(false)}
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full hover:bg-white/10 text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div ref={lyricsContainerRef} className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth">
              <div className="max-w-3xl mx-auto space-y-6 min-h-[60vh] flex flex-col justify-center">
                {activeLyrics.map((line, index) => {
                  const isBlank = line.text.trim() === ''
                  const isActive = index === currentLyricIndex

                  return (
                    <div key={index} data-lyric-index={index} className={`text-center transition-all duration-500 ${isBlank ? 'h-6' : ''}`}>
                      {!isBlank ? (
                        <>
                          {isTimingMode && (
                            <div className="mb-1 text-xs text-gray-500">
                              {index === timingIndex ? '▶ ' : ''}
                              t={Number(line.time || 0).toFixed(2)}s
                            </div>
                          )}
                          <p
                            className={`text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed transition-all duration-500 px-4 ${
                              isActive
                                ? isDarkMode
                                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 scale-105 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                                  : 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 scale-105 drop-shadow-[0_0_20px_rgba(251,113,133,0.4)]'
                                : index < currentLyricIndex
                                ? 'text-gray-600 scale-95 opacity-50'
                                : 'text-gray-500 scale-90 opacity-35'
                            }`}
                          >
                            {line.text}
                          </p>
                        </>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>

            <div
              className={`p-6 backdrop-blur-sm ${
                isDarkMode ? 'bg-slate-900/50 border-t border-white/10' : 'bg-white/10 border-t border-white/20'
              }`}
            >
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
                  className={`w-16 h-16 rounded-full shadow-lg ${
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
                  className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-cyan-500/20 hover:bg-cyan-500/30' : 'bg-rose-500/20 hover:bg-rose-500/30'}`}
                >
                  <SkipForward className={`h-5 w-5 ${isDarkMode ? 'text-cyan-400' : 'text-rose-400'}`} />
                </Button>

                <div className="flex-1">
                  <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={handleSeek} className="cursor-pointer" />
                  <div className="flex justify-between text-xs mt-2 text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {isTimingMode && (
                <div className="mt-4 max-w-4xl mx-auto text-xs text-gray-400">
                  Tip: Play the song, then press <b>Space</b> exactly when each line starts. After finishing, click <b>Copy JSON</b> and paste
                  it back into the <code>lyrics</code> for that song.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}