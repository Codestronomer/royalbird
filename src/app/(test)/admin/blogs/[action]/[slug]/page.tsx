import BlogForm from "~/components/blog/blogForm";

export default async function Page({ params }: { params: Promise<{ action: string; slug: string }> }) {
  const { action, slug } = await params;

  return (
    <BlogForm action={action as 'new' | 'edit'} blogSlug={slug} />
  )
}