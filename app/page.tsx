'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ArrowRight, Code2, Database, Palette, ChevronLeft, ChevronRight, MessageCircle, Moon, Sun } from "lucide-react"
import MusicPlayer from "@/components/MusicPlayer"

const projects = [
  {
    title: "Personal Portfolio Website",
    description: "Responsive portfolio built with Next.js and Tailwind CSS, showcasing projects and skills with smooth animations",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    title: "Task Management App",
    description: "Full-stack todo application with user authentication and real-time updates using Supabase",
    tech: ["React", "Supabase", "JavaScript", "CSS"],
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    title: "Weather Dashboard",
    description: "Interactive weather app fetching real-time data from external APIs with clean UI design",
    tech: ["JavaScript", "HTML", "CSS", "API Integration"],
    image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    title: "Blog Platform",
    description: "Simple blogging platform with markdown support and responsive design for all devices",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    image: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
]

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express", "Supabase", "PostgreSQL", "REST APIs"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code", "Postman", "Figma", "npm"] },
  { category: "Learning", items: ["Docker", "AWS", "MongoDB", "GraphQL", "Testing"] }
]

export default function Home() {
  const [currentProject, setCurrentProject] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [sectionAnimations, setSectionAnimations] = useState<Record<string, 'in' | 'out' | 'hidden'>>({
    about: 'in',
    skills: 'hidden',
    projects: 'hidden',
    contact: 'hidden'
  })
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [touchRipples, setTouchRipples] = useState<Array<{id: number, x: number, y: number}>>([])
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const minSwipeDistance = 50

  useEffect(() => {
    setIsMounted(true)
    setIsVisible(true)

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id))
        }
      })
    }, observerOptions)

    const sections = ['about', 'skills', 'projects', 'contact']
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    const swipeHintTimer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 4000)

    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100
      const currentScrollY = window.scrollY

      setScrollY(currentScrollY)

      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (currentScrollY / windowHeight) * 100
      setScrollProgress(scrolled)

      const direction = currentScrollY > lastScrollY ? 'down' : 'up'
      setScrollDirection(direction)

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      setLastScrollY(currentScrollY)

      const newAnimations: Record<string, 'in' | 'out' | 'hidden'> = {}
      const viewportHeight = window.innerHeight

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const sectionTop = rect.top
          const sectionBottom = rect.bottom

          if (sectionTop < viewportHeight * 0.75 && sectionBottom > viewportHeight * 0.25) {
            newAnimations[section] = 'in'
          } else if (sectionTop < viewportHeight * 0.25) {
            newAnimations[section] = direction === 'down' ? 'out' : 'in'
          } else if (sectionBottom > viewportHeight * 0.75) {
            newAnimations[section] = direction === 'up' ? 'out' : 'in'
          } else {
            newAnimations[section] = 'hidden'
          }

          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section)
          }
        }
      }

      setSectionAnimations(newAnimations)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePosition({ x, y })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      observer.disconnect()
      clearTimeout(swipeHintTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [lastScrollY])

  const createTouchRipple = (e: React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top
    const id = Date.now()

    setTouchRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setTouchRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setShowSwipeHint(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextProject()
    }
    if (isRightSwipe) {
      prevProject()
    }
  }

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  const nextProject = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevProject = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <main className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-black' : ''}`}>
      <div className="fixed inset-0 z-0">
        <div
          className="w-full h-full transition-transform duration-700 ease-out animate-bg-zoom"
          style={isMounted ? {
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px) scale(1.1) rotate(${mousePosition.x * 2}deg)`
          } : {}}
        >
          <img
            src="/AAGiea67SZQ_1760388181671.jpg"
            alt="Background"
            className={`w-full h-full object-cover animate-bg-rotate-subtle transition-all duration-500 ${isDarkMode ? 'grayscale' : ''}`}
          />
        </div>
        <div className={`absolute inset-0 backdrop-blur-sm transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-black/85 via-black/90 to-black/85' : 'bg-gradient-to-br from-white/85 via-white/80 to-white/85'}`}></div>

        <div
          className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-pink-50/30 to-fuchsia-100/40 animate-mesh-gradient"
          style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, rgba(251, 113, 133, 0.3) 0px, transparent 50%),
              radial-gradient(at 80% 20%, rgba(244, 114, 182, 0.25) 0px, transparent 50%),
              radial-gradient(at 40% 70%, rgba(232, 121, 249, 0.2) 0px, transparent 50%),
              radial-gradient(at 90% 80%, rgba(251, 113, 133, 0.15) 0px, transparent 50%)
            `,
            opacity: 0.4 + (scrollY / 2000)
          }}
        ></div>

        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={isMounted ? {
            transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`
          } : {}}
        >
          <div className="absolute top-20 left-20 w-64 h-64 bg-rose-400/25 rounded-full blur-3xl animate-orb-drift"></div>
          <div className="absolute top-1/3 right-32 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-orb-drift-alt"></div>
          <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-fuchsia-400/25 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-rose-300/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-orb-drift"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`golden-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-400 animate-float opacity-50"
              style={{
                left: `${(i * 20 + 10) % 85}%`,
                top: `${(i * 17 + 10) % 80}%`,
                width: `${60 + (i % 3) * 40}px`,
                height: `${60 + (i % 3) * 40}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + (i % 3) * 2}s`,
                filter: 'blur(3px)',
                boxShadow: '0 0 60px rgba(251, 191, 36, 0.6), 0 0 100px rgba(251, 191, 36, 0.4)'
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-rose-500/5 via-transparent to-transparent animate-wave"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-pink-500/5 via-transparent to-transparent animate-wave-reverse"></div>
        </div>

        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-sparkle"
            style={{
              left: `${(i * 7 + Math.sin(i) * 20 + 10) % 95}%`,
              top: `${(i * 5 + Math.cos(i) * 15 + 10) % 90}%`,
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background: i % 3 === 0
                ? 'radial-gradient(circle, rgba(251, 113, 133, 0.8) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(244, 114, 182, 0.8) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(232, 121, 249, 0.8) 0%, transparent 70%)',
              boxShadow: i % 2 === 0
                ? '0 0 8px rgba(251, 113, 133, 0.6), 0 0 12px rgba(251, 113, 133, 0.4)'
                : '0 0 8px rgba(244, 114, 182, 0.6), 0 0 12px rgba(244, 114, 182, 0.4)',
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + (i % 4)}s`
            }}
          />
        ))}
      </div>

      <div className={`fixed top-0 left-0 w-full h-1 z-50 transition-colors duration-500 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200/50'}`}>
        <div
          className={`h-full transition-all duration-300 ease-out ${isDarkMode ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500' : 'bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400'}`}
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <nav className={`fixed top-0 left-0 right-0 backdrop-blur-md z-40 border-b transition-all duration-500 ease-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${isDarkMode ? 'bg-black/70 border-white/10' : 'bg-white/70 border-rose-100/50'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={`text-2xl font-bold transition-all duration-500 ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent'}`}>
            Blushy Girl
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className={`relative text-sm font-medium transition-all duration-300 ${
                activeSection === 'about'
                  ? (isDarkMode ? 'text-cyan-400' : 'text-rose-600')
                  : isDarkMode ? 'text-white hover:text-cyan-400' : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              About
              {activeSection === 'about' && (
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
            <a
              href="#skills"
              onClick={(e) => scrollToSection(e, 'skills')}
              className={`relative text-sm font-medium transition-all duration-300 ${
                activeSection === 'skills'
                  ? (isDarkMode ? 'text-cyan-400' : 'text-rose-600')
                  : isDarkMode ? 'text-white hover:text-cyan-400' : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Skills
              {activeSection === 'skills' && (
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className={`relative text-sm font-medium transition-all duration-300 ${
                activeSection === 'projects'
                  ? (isDarkMode ? 'text-cyan-400' : 'text-rose-600')
                  : isDarkMode ? 'text-white hover:text-cyan-400' : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Projects
              {activeSection === 'projects' && (
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className={`relative text-sm font-medium transition-all duration-300 ${
                activeSection === 'contact'
                  ? (isDarkMode ? 'text-cyan-400' : 'text-rose-600')
                  : isDarkMode ? 'text-white hover:text-cyan-400' : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Contact
              {activeSection === 'contact' && (
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`md:hidden p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none group"
              aria-label="Toggle menu"
            >
            <span
              className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-out ${isDarkMode ? 'bg-white' : 'bg-rose-600'} ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-out ${isDarkMode ? 'bg-white' : 'bg-rose-600'} ${
                isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 rounded-full transition-all duration-300 ease-out ${isDarkMode ? 'bg-white' : 'bg-rose-600'} ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
          </div>
        </div>

        <div
          className={`md:hidden fixed top-[73px] left-0 right-0 backdrop-blur-md shadow-2xl transition-all duration-500 ease-out border-b overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          } ${isDarkMode ? 'bg-black/95 border-white/10' : 'bg-white/95 border-rose-100/50'}`}
        >
          <div className="flex flex-col p-6 gap-4">
            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className={`relative text-lg font-medium transition-all duration-300 py-3 px-4 rounded-lg ${
                activeSection === 'about'
                  ? (isDarkMode ? 'text-cyan-400 bg-white/5' : 'text-rose-600 bg-rose-50')
                  : isDarkMode ? 'text-white hover:text-cyan-400 hover:bg-white/5' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              About
              {activeSection === 'about' && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-b from-cyan-500 to-teal-500' : 'bg-gradient-to-b from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
            <a
              href="#skills"
              onClick={(e) => scrollToSection(e, 'skills')}
              className={`relative text-lg font-medium transition-all duration-300 py-3 px-4 rounded-lg ${
                activeSection === 'skills'
                  ? (isDarkMode ? 'text-cyan-400 bg-white/5' : 'text-rose-600 bg-rose-50')
                  : isDarkMode ? 'text-white hover:text-cyan-400 hover:bg-white/5' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              Skills
              {activeSection === 'skills' && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-b from-cyan-500 to-teal-500' : 'bg-gradient-to-b from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className={`relative text-lg font-medium transition-all duration-300 py-3 px-4 rounded-lg ${
                activeSection === 'projects'
                  ? (isDarkMode ? 'text-cyan-400 bg-white/5' : 'text-rose-600 bg-rose-50')
                  : isDarkMode ? 'text-white hover:text-cyan-400 hover:bg-white/5' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              Projects
              {activeSection === 'projects' && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-b from-cyan-500 to-teal-500' : 'bg-gradient-to-b from-rose-500 to-pink-500'}`}></span>
              )}
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, 'contact')}
              className={`relative text-lg font-medium transition-all duration-300 py-3 px-4 rounded-lg ${
                activeSection === 'contact'
                  ? (isDarkMode ? 'text-cyan-400 bg-white/5' : 'text-rose-600 bg-rose-50')
                  : isDarkMode ? 'text-white hover:text-cyan-400 hover:bg-white/5' : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              Contact
              {activeSection === 'contact' && (
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-b from-cyan-500 to-teal-500' : 'bg-gradient-to-b from-rose-500 to-pink-500'}`}></span>
              )}
            </a>

            <div className="border-t border-rose-100 pt-4 mt-2">
              <div className="flex gap-4 justify-center">
                <a href="#" className="p-3 rounded-full border border-slate-300 hover:border-rose-500 hover:bg-rose-50 transition-all">
                  <Github className="h-5 w-5 text-slate-600" />
                </a>
                <a href="#" className="p-3 rounded-full border border-slate-300 hover:border-rose-500 hover:bg-rose-50 transition-all">
                  <Linkedin className="h-5 w-5 text-slate-600" />
                </a>
                <a href="#" className="p-3 rounded-full border border-slate-300 hover:border-rose-500 hover:bg-rose-50 transition-all">
                  <Mail className="h-5 w-5 text-slate-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 top-[73px] bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-30"
          />
        )}
      </nav>

      <section id="about" className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
        <div className={`max-w-7xl w-full transition-all duration-700 ${
          sectionAnimations.about === 'in' ? 'opacity-100 translate-y-0' :
          sectionAnimations.about === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
          'opacity-0 translate-y-20'
        }`}>
          <div className="mb-12 max-w-md mx-auto lg:mx-0">
            <MusicPlayer />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className={`font-bold tracking-wide text-sm drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`}>FRESHER FULL STACK DEVELOPER</p>
                <h1 className="text-6xl font-bold leading-tight">
                  <span className={`transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]'}`}>Hi, I'm</span>
                  <span className="block bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)]">
                    Blushy Girl
                  </span>
                </h1>
              </div>
              <p className={`text-xl leading-relaxed font-semibold transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-slate-900 drop-shadow-[0_2px_6px_rgba(255,255,255,0.95)]'}`}>
                Recent graduate passionate about creating beautiful, functional web applications.
                Eager to learn, grow, and contribute to innovative projects with modern technologies.
              </p>
              <div className="flex gap-4 pt-4">
                <Button className={`text-white px-8 active:scale-95 transition-transform ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'}`}>
                  View Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => window.open('/AmalenduA.CV.pdf', '_blank')}
                  variant="outline"
                  className={`active:scale-95 transition-all duration-300 ${isDarkMode ? 'border-white/20 text-white hover:border-cyan-500 hover:text-cyan-400' : 'border-slate-300 hover:border-rose-500 hover:text-rose-500'}`}
                >
                  Download CV
                </Button>
              </div>
              <div className="flex gap-4 pt-4">
                <a href="#" className={`p-3 rounded-full border transition-all duration-300 ${isDarkMode ? 'border-white/20 hover:border-cyan-500 hover:bg-white/5' : 'border-slate-300 hover:border-rose-500 hover:bg-rose-50'}`}>
                  <Github className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
                </a>
                <a href="#" className={`p-3 rounded-full border transition-all duration-300 ${isDarkMode ? 'border-white/20 hover:border-cyan-500 hover:bg-white/5' : 'border-slate-300 hover:border-rose-500 hover:bg-rose-50'}`}>
                  <Linkedin className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
                </a>
                <a href="#" className={`p-3 rounded-full border transition-all duration-300 ${isDarkMode ? 'border-white/20 hover:border-cyan-500 hover:bg-white/5' : 'border-slate-300 hover:border-rose-500 hover:bg-rose-50'}`}>
                  <Mail className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
                </a>
              </div>
            </div>

            <div
              className="relative parallax-slow"
              style={isMounted ? {
                transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`
              } : {}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-300 via-pink-300 to-fuchsia-300 rounded-3xl blur-2xl opacity-10 animate-float"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-rose-100 interactive-glow">
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-rose-200 shadow-lg">
                    <img
                      src="/AAGiea67SZQ_1760388181671.jpg"
                      alt="Blushy Girl"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl">
                    <Code2 className="h-6 w-6 mx-auto mb-2 text-rose-500" />
                    <p className="text-2xl font-bold text-slate-900">10+</p>
                    <p className="text-slate-700 text-sm font-semibold">Projects</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-fuchsia-50 rounded-xl">
                    <Database className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                    <p className="text-2xl font-bold text-slate-900">Fresher</p>
                    <p className="text-slate-700 text-sm font-semibold">Experience</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-xl">
                    <Palette className="h-6 w-6 mx-auto mb-2 text-fuchsia-500" />
                    <p className="text-2xl font-bold text-slate-900">2024</p>
                    <p className="text-slate-700 text-sm font-semibold">Graduate</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                    <Code2 className="h-6 w-6 mx-auto mb-2 text-pink-600" />
                    <p className="text-2xl font-bold text-slate-900">8+</p>
                    <p className="text-slate-700 text-sm font-semibold">Technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 px-6 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            sectionAnimations.skills === 'in' ? 'opacity-100 translate-y-0' :
            sectionAnimations.skills === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
            'opacity-0 translate-y-20'
          }`}>
            <p className={`font-bold tracking-wide mb-2 text-sm ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`}>EXPERTISE</p>
            <h2 className={`text-5xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Skills & Technologies</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {skills.map((skillSet, idx) => (
              <Card
                key={idx}
                onTouchStart={createTouchRipple}
                className={`p-6 hover:shadow-xl transition-all duration-500 hover:scale-105 backdrop-blur-sm interactive-glow parallax-slow active:scale-95 relative overflow-hidden ${
                  isDarkMode ? 'border-white/10 hover:border-white/30 bg-white/5' : 'border-slate-200 hover:border-rose-200 bg-white/80'
                } ${
                  sectionAnimations.skills === 'in' ? 'opacity-100 translate-y-0' :
                  sectionAnimations.skills === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
                  'opacity-0 translate-y-20'
                }`}
                style={isMounted ? {
                  transform: `translate(${mousePosition.x * (idx % 2 === 0 ? 5 : -5)}px, ${mousePosition.y * (idx % 2 === 0 ? 5 : -5)}px)`,
                  transitionDelay: `${idx * 100}ms`
                } : { transitionDelay: `${idx * 100}ms` }}
              >
                {touchRipples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full bg-rose-400/30 pointer-events-none animate-ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: '20px',
                      height: '20px',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
                <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`font-semibold transition-all active:scale-90 ${isDarkMode ? 'bg-white/10 text-white hover:bg-cyan-500/20 hover:text-cyan-300' : 'bg-slate-100 text-slate-800 hover:bg-rose-100 hover:text-rose-700'}`}
                      style={{
                        animationDelay: `${(idx * 100) + (index * 50)}ms`
                      }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${
            sectionAnimations.projects === 'in' ? 'opacity-100 translate-y-0' :
            sectionAnimations.projects === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
            'opacity-0 translate-y-20'
          }`}>
            <p className={`font-bold tracking-wide mb-2 text-sm ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`}>PORTFOLIO</p>
            <h2 className={`text-5xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Featured Projects</h2>
          </div>

          <div className={`relative perspective-1000 transition-all duration-700 ${
            sectionAnimations.projects === 'in' ? 'opacity-100 translate-y-0' :
            sectionAnimations.projects === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
            'opacity-0 translate-y-20'
          }`}>
            <div
              className="overflow-hidden rounded-2xl"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Card className={`overflow-hidden transition-all duration-500 ${
                isDarkMode ? 'border-white/10 bg-white/5' : 'border-rose-200 bg-white'
              } ${
                isTransitioning ? 'scale-95 opacity-50 rotate-y-12' : 'scale-100 opacity-100 rotate-y-0'
              }`}>
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-[400px] lg:h-[500px] overflow-hidden group">
                    <div className={`absolute inset-0 transition-all duration-700 ${
                      isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'
                    }`}>
                      <img
                        src={projects[currentProject].image}
                        alt={projects[currentProject].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className={`p-8 lg:p-12 flex flex-col justify-center transition-all duration-500 ${
                    isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
                  }`}>
                    <div className="mb-4">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`}>PROJECT {currentProject + 1} / {projects.length}</span>
                    </div>
                    <h3 className={`text-4xl font-bold mb-4 transition-all duration-500 ${isDarkMode ? 'text-white hover:text-cyan-400' : 'text-slate-900 hover:text-rose-600'}`}>
                      {projects[currentProject].title}
                    </h3>
                    <p className={`text-lg mb-6 leading-relaxed font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>{projects[currentProject].description}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {projects[currentProject].tech.map((tech, idx) => (
                        <Badge
                          key={idx}
                          className={`text-white hover:scale-110 transition-transform duration-300 ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}
                          style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button className={`hover:scale-105 transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'}`}>
                        View Project
                      </Button>
                      <Button variant="outline" className={`hover:scale-105 transition-all duration-300 ${isDarkMode ? 'border-white/20 text-white hover:border-cyan-500 hover:text-cyan-400' : 'border-slate-300 hover:border-rose-500 hover:text-rose-500'}`}>
                        <Github className="mr-2 h-4 w-4" /> Code
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <button
              onClick={prevProject}
              disabled={isTransitioning}
              className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 md:p-3 w-12 h-12 md:w-auto md:h-auto rounded-full backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:-translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/90 hover:bg-rose-50'}`}
            >
              <ChevronLeft className={`h-6 w-6 transition-colors ${isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-rose-600'}`} />
            </button>

            <button
              onClick={nextProject}
              disabled={isTransitioning}
              className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 md:p-3 w-12 h-12 md:w-auto md:h-auto rounded-full backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/90 hover:bg-rose-50'}`}
            >
              <ChevronRight className={`h-6 w-6 transition-colors ${isDarkMode ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-rose-600'}`} />
            </button>

            <div className="flex justify-center gap-2 mt-8 relative">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx !== currentProject) {
                      setIsTransitioning(true)
                      setTimeout(() => {
                        setCurrentProject(idx)
                        setIsTransitioning(false)
                      }, 300)
                    }
                  }}
                  disabled={isTransitioning}
                  className={`h-2 rounded-full transition-all duration-300 hover:scale-125 disabled:cursor-not-allowed active:scale-90 ${
                    idx === currentProject
                      ? (isDarkMode ? 'w-8 bg-gradient-to-r from-cyan-500 to-teal-500 shadow-lg' : 'w-8 bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg')
                      : (isDarkMode ? 'w-2 bg-slate-500 hover:bg-cyan-400' : 'w-2 bg-slate-300 hover:bg-rose-300')
                  }`}
                />
              ))}
            </div>

            {showSwipeHint && (
              <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-bounce-in">
                <ChevronLeft className={`h-4 w-4 animate-pulse ${isDarkMode ? 'text-cyan-500' : 'text-rose-500'}`} />
                <span className="text-xs font-medium text-slate-700">Swipe to explore</span>
                <ChevronRight className={`h-4 w-4 animate-pulse ${isDarkMode ? 'text-cyan-500' : 'text-rose-500'}`} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-700 ${
            sectionAnimations.contact === 'in' ? 'opacity-100 translate-y-0' :
            sectionAnimations.contact === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
            'opacity-0 translate-y-20'
          }`}>
            <p className={`font-bold tracking-wide mb-2 text-sm ${isDarkMode ? 'text-cyan-400' : 'text-rose-600'}`}>GET IN TOUCH</p>
            <h2 className={`text-5xl font-bold mb-6 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Let's Connect</h2>
            <p className={`text-xl mb-12 font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>
              I'm actively looking for opportunities to start my career. Let's connect and discuss how I can contribute to your team!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 relative z-10">
            <Card
              onTouchStart={createTouchRipple}
              className={`p-6 hover:shadow-xl transition-all duration-500 backdrop-blur-sm interactive-glow parallax-slow active:scale-95 relative overflow-hidden ${
                isDarkMode ? 'border-white/10 hover:border-white/30 bg-white/5' : 'border-slate-200 hover:border-rose-200 bg-white/80'
              } ${
                sectionAnimations.contact === 'in' ? 'opacity-100 translate-y-0' :
                sectionAnimations.contact === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
                'opacity-0 translate-y-20'
              }`}
              style={isMounted ? {
                transform: `translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)`,
                transitionDelay: '100ms'
              } : { transitionDelay: '100ms' }}
            >
              <Mail className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? 'text-cyan-400' : 'text-rose-500'}`} />
              <h3 className={`font-bold mb-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email</h3>
              <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>amalendua10@gmail.com</p>
            </Card>

            <Card
              onTouchStart={createTouchRipple}
              className={`p-6 hover:shadow-xl transition-all duration-500 backdrop-blur-sm interactive-glow active:scale-95 relative overflow-hidden ${
                isDarkMode ? 'border-white/10 hover:border-white/30 bg-white/5' : 'border-slate-200 hover:border-rose-200 bg-white/80'
              } ${
                sectionAnimations.contact === 'in' ? 'opacity-100 translate-y-0' :
                sectionAnimations.contact === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
                'opacity-0 translate-y-20'
              }`}
              style={{
                transitionDelay: '200ms'
              }}
            >
              <Github className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? 'text-cyan-400' : 'text-rose-500'}`} />
              <h3 className={`font-bold mb-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GitHub</h3>
              <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>@blushygirl</p>
            </Card>

            <Card
              onTouchStart={createTouchRipple}
              className={`p-6 hover:shadow-xl transition-all duration-500 backdrop-blur-sm interactive-glow parallax-slow active:scale-95 relative overflow-hidden ${
                isDarkMode ? 'border-white/10 hover:border-white/30 bg-white/5' : 'border-slate-200 hover:border-rose-200 bg-white/80'
              } ${
                sectionAnimations.contact === 'in' ? 'opacity-100 translate-y-0' :
                sectionAnimations.contact === 'out' ? (scrollDirection === 'down' ? 'opacity-0 -translate-y-20' : 'opacity-0 translate-y-20') :
                'opacity-0 translate-y-20'
              }`}
              style={isMounted ? {
                transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`,
                transitionDelay: '300ms'
              } : { transitionDelay: '300ms' }}
            >
              <Linkedin className={`h-8 w-8 mx-auto mb-4 ${isDarkMode ? 'text-cyan-400' : 'text-rose-500'}`} />
              <h3 className={`font-bold mb-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LinkedIn</h3>
              <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>/in/blushygirl</p>
            </Card>
          </div>

          <Button
            onClick={() => {
              const phoneNumber = '917306064252'
              const message = 'Hi! I visited your portfolio and would love to connect.'
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
              window.open(whatsappUrl, '_blank')
            }}
            className={`text-white px-12 py-6 text-lg active:scale-95 transition-all duration-700 ${
              isDarkMode ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600' : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
            } ${
              visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}
            style={{
              transitionDelay: '400ms'
            }}
          >
            Send Message <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <footer className={`py-12 px-6 transition-colors duration-500 ${isDarkMode ? 'bg-black border-t border-white/10' : 'bg-slate-900'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={`transition-colors duration-500 ${isDarkMode ? 'text-gray-400' : 'text-slate-400'}`}>© 2024 Blushy Girl. Crafted with passion and code.</p>
        </div>
      </footer>
    </main>
  )
}
