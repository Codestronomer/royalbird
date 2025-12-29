// components/blog/TableOfContents.tsx
'use client'

import { useState, useEffect } from 'react';
import { Hash, Menu, X } from 'lucide-react';

interface Heading {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  mobile?: boolean
}

export default function TableOfContents({ mobile }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(!mobile)
  const [headings, setHeadings] = useState<Heading[]>([])
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    const extractHeadings = () => {
      const article = document.querySelector('article')
      const readTime = document.getElementById('readtime')
      if (readTime) {
        const timeText = readTime.textContent || '0'
        const timeMatch = /(\d+)\s*min/.exec(timeText)
        if (timeMatch && typeof timeMatch[1] === 'string') {
          setReadingTime(parseInt(timeMatch[1], 10))
        }
      }

      if (!article) return []
      
      const headingElements = article.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const extracted: Heading[] = []
      
      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent || ''
        
        // Get or create ID
        let id = heading.id
        if (!id) {
          id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
          heading.id = id
        }
        
        // Ensure unique ID
        if (extracted.some(h => h.id === id)) {
          id = `${id}-${index}`
          heading.id = id
        }
        
        extracted.push({
          level,
          text,
          id,
        })
      })
      
      return extracted
    }
    
    // Wait a bit for the content to render
    const timeoutId = setTimeout(() => {
      setHeadings(extractHeadings())
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // Smooth scroll to heading
  const handleHeadingClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    if (mobile) setIsOpen(false)
    
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update URL without page refresh
      window.history.pushState(null, '', `#${id}`)
    }
  }

  return (
    <div className={`${mobile ? 'bg-white rounded-2xl shadow-2xl border border-slate-200 p-6' : ''}`}>
      {mobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full mb-4"
        >
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            <span className="font-bold text-slate-900">Contents</span>
          </div>
          {isOpen ? <X className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
        </button>
      )}
      
      {isOpen && headings.length > 0 && (
        <nav className={`${!mobile ? 'sticky top-24' : ''}`}>
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Navigation
            </h3>
            <p className="text-sm text-slate-600 mt-1">Jump to any section</p>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto pr-4">
            {headings.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                onClick={(e) => handleHeadingClick(e, heading.id)}
                className={`block py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors duration-300 border-l-2 border-transparent hover:border-blue-500 ${mobile ? 'text-sm' : ''}`}
                style={{ paddingLeft: `${(heading.level - 1) * 1.5 + 0.75}rem` }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ${heading.level === 1 ? 'scale-125' : ''}`} />
                  <span className={`${heading.level === 1 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {heading.text}
                  </span>
                </div>
              </a>
            ))}
          </div>
          
          {!mobile && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{headings.length}</span> sections
                • <span className="font-bold text-slate-900">
                  {readingTime}
                </span> min read
              </p>
            </div>
          )}
        </nav>
      )}
      
      {isOpen && headings.length === 0 && !mobile && (
        <div className="text-sm text-slate-500 italic">
          No headings found in this article
        </div>
      )}
    </div>
  )
}