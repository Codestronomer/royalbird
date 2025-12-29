// lib/mdx-components.tsx
import React, { type DetailedHTMLProps, type HTMLAttributes, type OlHTMLAttributes } from 'react'
import type {
  HeadingProps,
  ParagraphProps,
  AnchorProps,
  ListProps,
  ListItemProps,
  CodeProps,
  BlockquoteProps,
  TableProps,
  ImageProps,
  MDXComponentProps
} from '~/types/mdx'
import CustomImage from '~/components/blog/customImage'

export const mdxComponents = {
  // Headings
  h1: ({ children, className = '', ...props }: HeadingProps) => (
    <h1 
      className={`text-4xl font-black text-slate-900 mt-8 mb-4 ${className}`} 
      {...props}
    >
      {children}
    </h1>
  ),
  
  h2: ({ children, className = '', ...props }: HeadingProps) => (
    <h2 
      className={`text-3xl font-black text-slate-900 mt-8 mb-4 ${className}`} 
      {...props}
    >
      {children}
    </h2>
  ),
  
  h3: ({ children, className = '', ...props }: HeadingProps) => (
    <h3 
      className={`text-2xl font-bold text-slate-800 mt-6 mb-3 ${className}`} 
      {...props}
    >
      {children}
    </h3>
  ),
  
  h4: ({ children, className = '', ...props }: HeadingProps) => (
    <h4 
      className={`text-xl font-bold text-slate-800 mt-6 mb-3 ${className}`} 
      {...props}
    >
      {children}
    </h4>
  ),
  
  // Paragraph
  p: ({ children, className = '', ...props }: ParagraphProps) => (
    <p 
      className={`text-slate-700 leading-relaxed my-4 font-light ${className}`} 
      {...props}
    >
      {children}
    </p>
  ),
  
  // Anchor
  a: ({ children, className = '', href, ...props }: AnchorProps) => (
    <a 
      href={href}
      className={`
      relative font-semibold transition-all duration-300
      hover:text-purple-500 hover:text-transparent
      bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600
      bg-gradient-to-r from-purple-600 to-blue-700
      underline underline-offset-4 hover:decoration-purple-400/50 decoration-transparent
      ${className}
    `} 
      {...props}
    >
      {children}
    </a>
  ),
  
  ul: ({ children, className = '', ...props }: ListProps) => (
    <ul 
      className={`list-none space-y-2 my-4 ${className}`} 
      {...props}
    >
      {children}
    </ul>
  ),
  
  ol: ({ children, className = '', ...props }: DetailedHTMLProps<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <ol
      className={`list-decimal list-inside space-y-2 my-4 ml-4 ${className}`} 
      {...props}
    >
      {children}
    </ol>
  ),
  
  li: ({ children, className = '', ...props }: ListItemProps) => (
    <li 
      className={`flex items-start gap-3 my-2 ${className}`} 
      {...props}
    >
      <span className="text-blue-500 font-bold mt-1">✦</span>
      <span>{children}</span>
    </li>
  ),
  
  // Blockquote
  blockquote: ({ children, className = '', ...props }: BlockquoteProps) => (
    <blockquote 
      className={`border-l-4 border-blue-500 bg-blue-50/50 py-4 px-8 italic text-slate-700 my-6 rounded-r-lg ${className}`} 
      {...props}
    >
      {children}
    </blockquote>
  ),
  
  // Code
  code: ({ children, className = '', ...props }: CodeProps) => (
    <code 
      className={`bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono ${className}`} 
      {...props}
    >
      {children}
    </code>
  ),
  
  pre: ({ children, className = '', ...props }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={`bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-6 border border-slate-800 ${className}`} 
      {...props}
    >
      {children}
    </pre>
  ),
  
  // Horizontal Rule
  hr: ({ className = '', ...props }: HTMLAttributes<HTMLHRElement>) => (
    <hr 
      className={`my-8 border-slate-200 ${className}`} 
      {...props}
    />
  ),
  
  // Table
  table: ({ children, className = '', ...props }: TableProps) => (
    <div className={`overflow-x-auto my-6 ${className}`}>
      <table 
        className="min-w-full border-collapse border border-slate-200" 
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  
  th: ({ children, className = '', ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th 
      className={`border border-slate-200 bg-slate-50 px-4 py-2 text-left font-bold text-slate-900 ${className}`} 
      {...props}
    >
      {children}
    </th>
  ),
  
  td: ({ children, className = '', ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td 
      className={`border border-slate-200 px-4 py-2 text-slate-700 ${className}`} 
      {...props}
    >
      {children}
    </td>
  ),
  
  // Image - using Next.js Image component
  img: ({ src, alt, width, height, className = '', ...props }: ImageProps) => {
    // You might want to use a custom Image component here
    return (
      <CustomImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-xl shadow-lg border border-slate-200 ${className}`}
        {...props}
      />
    )
  },
  
  // Custom components
  Callout: ({ children, type = 'info', title, ...props }: MDXComponentProps & { 
    type?: 'info' | 'warning' | 'success' | 'tip' 
    title?: string 
  }) => {
    const config = {
      info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'ℹ️' },
      warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '⚠️' },
      success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅' },
      tip: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '💡' },
    }[type]
    
    return (
      <div 
        className={`${config.bg} border-l-4 ${config.border} rounded-r-lg p-4 my-6 ${props.className ?? ''}`}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="text-lg">{config.icon}</div>
          <div>
            {title && <div className="font-bold text-slate-800 mb-2">{title}</div>}
            <div className="text-slate-700">{children}</div>
          </div>
        </div>
      </div>
    )
  },
  
  // More custom components as needed
  ComicPanel: ({ children, caption, ...props }: MDXComponentProps & { caption?: string }) => (
    <div className="my-8 border-4 border-slate-900 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900 p-1" {...props}>
      <div className="bg-white p-6 rounded-lg">
        {children}
        {caption && (
          <div className="mt-4 text-center text-sm text-slate-600 italic border-t border-slate-200 pt-3">
            {caption}
          </div>
        )}
      </div>
    </div>
  ),
}