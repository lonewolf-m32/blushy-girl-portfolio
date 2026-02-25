'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Volume2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => setIsPlaying(false))

    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      setIsPlaying(false)
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

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

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-rose-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <audio ref={audioRef} src="/Husn_-_Djjohal.fm.mp3" />

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-400 to-pink-400"></div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-lg">Husn</h3>
          <p className="text-slate-600 text-sm">Now Playing</p>
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
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlayPause}
            size="lg"
            className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" fill="white" />
            ) : (
              <Play className="h-6 w-6" fill="white" />
            )}
          </Button>

          <div className="flex items-center gap-2 flex-1">
            <Volume2 className="h-5 w-5 text-rose-500" />
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
  )
}
