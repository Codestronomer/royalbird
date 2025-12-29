import type { ComponentProps, DetailedHTMLProps, HTMLAttributes } from 'react';

// Basic heading props
export type HeadingProps = DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>, 
  HTMLHeadingElement
>

// Paragraph props
export type ParagraphProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>, 
  HTMLParagraphElement
>

// Anchor props
export type AnchorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLAnchorElement>, 
  HTMLAnchorElement
> & {
  href?: string
}

// List props
export type ListProps = DetailedHTMLProps<
  HTMLAttributes<HTMLUListElement | HTMLOListElement>, 
  HTMLUListElement | HTMLOListElement
>

// List item props
export type ListItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLLIElement>, 
  HTMLLIElement
>

// Code block props
export type CodeProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>, 
  HTMLElement
>

// Blockquote props
export type BlockquoteProps = DetailedHTMLProps<
  HTMLAttributes<HTMLQuoteElement>, 
  HTMLQuoteElement
>

// Table props
export type TableProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableElement>, 
  HTMLTableElement
>

// Image props
export type ImageProps = DetailedHTMLProps<
  HTMLAttributes<HTMLImageElement>, 
  HTMLImageElement
> & {
  src: string
  alt: string
  width?: string
  height?: string
}

// Generic MDX component props
export type MDXComponentProps<T = unknown> = ComponentProps<'div'> & {
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}