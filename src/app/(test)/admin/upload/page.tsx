// "use client";

// import { UploadDropzone } from "@uploadthing/react";
// import { OurFileRouter } from "@/app/api/uploadthing/core";
// import { useState } from "react";
// import { toast } from "react-hot-toast";

// export default function UploadPage() {
//   const [images, setImages] = useState<{ url: string; name: string }[]>([]);

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <header className="mb-8">
//         <h1 className="text-2xl font-bold">Content Upload</h1>
//         <p className="text-gray-500">Upload new comic pages or blog assets.</p>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Upload Section */}
//         <section className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-white">
//           <h2 className="text-lg font-semibold mb-4">Add Comic Pages</h2>
//           <UploadDropzone<OurFileRouter, "comicUploader">
//             endpoint="comicUploader"
//             onClientUploadComplete={(res) => {
//               if (res) {
//                 setImages((prev) => [...prev, ...res.map(f => ({ url: f.url, name: f.name }))]);
//                 toast.success("Upload successful!");
//               }
//             }}
//             onUploadError={(error: Error) => {
//               toast.error(`ERROR! ${error.message}`);
//             }}
//           />
//         </section>

//         {/* Preview Section */}
//         <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
//           <h2 className="text-lg font-semibold mb-4">Upload Queue ({images.length})</h2>
//           {images.length === 0 ? (
//             <p className="text-gray-400 text-sm">No files uploaded yet.</p>
//           ) : (
//             <div className="space-y-3 max-h-[400px] overflow-y-auto">
//               {images.map((file, idx) => (
//                 <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded border">
//                   <Image src={file.url} alt="preview" className="w-12 h-12 object-cover rounded" />
//                   <span className="text-xs truncate flex-1">{file.name}</span>
//                   <button 
//                     onClick={() => setImages(images.filter((_, i) => i !== idx))}
//                     className="text-red-500 text-xs hover:underline"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>

//       {images.length > 0 && (
//         <div className="mt-8 flex justify-end">
//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
//             Proceed to Publish
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }