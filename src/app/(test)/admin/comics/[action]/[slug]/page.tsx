import ComicForm from "~/components/comic/comicForm";

export default async function Page({ params }: { params: Promise<{ action: 'new' | 'edit'; slug: string }> }) {
  const { action, slug } = await params;

  return (
    <ComicForm action={action} slug={slug} />
  )
}