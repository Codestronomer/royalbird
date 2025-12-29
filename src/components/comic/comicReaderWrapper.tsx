// app/components/comics/ComicReaderWrapper.tsx
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import ImageComicReader from './comicReader';
import { getBestFormat, getDeviceInfo } from '~/lib/utils';
import type { Comic } from '~/types/comics';

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