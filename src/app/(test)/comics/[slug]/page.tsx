// app/comics/[slug]/page.tsx
// 'use client'
import ComicReaderWrapper from '~/components/comic/comicReaderWrapper';
import { api } from '~/lib/api';
import { transformComic } from '~/lib/utils';


export default async function ComicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await api.getComic(slug)
  const comic = transformComic(response.data);
  
  if (!comic?.pdfUrl) {
    return <div>Comic not found</div>;
  }

  return (
    <ComicReaderWrapper
      pdfUrl={comic.pdfUrl}
      comic={{
        title: comic.title,
        publisher: comic.publisher,
        issueNumber: String(comic.issueNumber)
      }}
    />
  );
}