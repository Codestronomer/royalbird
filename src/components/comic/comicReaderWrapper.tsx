'use client';

import dynamic from 'next/dynamic';

const PdfComicReader = dynamic(
  () => import('./comicPdfReader'),
  { ssr: false }
);


export default function ComicReaderWrapper(props: React.ComponentProps<typeof PdfComicReader>) {
    return (
      <PdfComicReader
        {...props}
      />
    );
  }