import Link from "next/link";
import Image
 from "next/image";
import { Calendar, User } from "lucide-react";
interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    category: string;
    image: string;
  }
}

export default function BlogCard({ post}: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="overflow-hidden">
          <Image
            alt={post.title} 
            width={600} 
            height={300}
            src={post.image} 
            className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-[1.08]" 
          />
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-[serif] mb-2 group-hover:tracking-wider transition-all duration-300">
            {post.title}
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {post.description}
          </p>
        </div>
      </div>
    </Link>
      
    // <Link href={`/blog/${post.slug}`}>
    //   <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl">
    //     <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
    //       {post.image && (
    //         <Image
    //           src={post.image}
    //           alt={post.title}
    //           fill
    //           className="object-cover group-hover:scale-110 transition-transform duration-700"
    //         />
    //       )}
    //     </div>
    //     <div className="p-6">
    //       <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
    //         <div className="flex items-center gap-1">
    //           <Calendar className="w-4 h-4" />
    //           {new Date(post.date).toLocaleDateString()}
    //         </div>
    //         <div className="flex items-center gap-1">
    //           <User className="w-4 h-4" />
    //           {post.author}
    //         </div>
    //       </div>
          
    //       <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
    //         {post.title}
    //       </h3>
          
    //       <p className="text-slate-600 leading-relaxed line-clamp-3">
    //         {post.description}
    //       </p>
          
    //       <div className="mt-4">
    //         <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
    //           {post.category}
    //         </span>
    //       </div>
    //     </div>
    //   </article>
    // </Link>
  )
}