// app/terms/page.tsx
import { Shield, BookOpen, Users, AlertCircle, CheckCircle, FileText } from 'lucide-react'

export default function TermsPage() {
  const lastUpdated = "December 8, 2025"
  
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <CheckCircle className="w-6 h-6" />,
      content: "By accessing and using Royalbird Studios' website, services, and content, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services."
    },
    {
      title: "Content Ownership",
      icon: <BookOpen className="w-6 h-6" />,
      content: "All original comics, animations, artwork, characters, stories, and intellectual property displayed on this site are the exclusive property of Royalbird Studios unless otherwise stated. Content may not be reproduced, distributed, or used commercially without explicit written permission."
    },
    {
      title: "User Conduct",
      icon: <Users className="w-6 h-6" />,
      content: "Users agree not to use our services for any unlawful purpose or to solicit others to perform unlawful acts. You must not harass, abuse, insult, harm, defame, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, or disability."
    },
    {
      title: "Copyright & DMCA",
      icon: <Shield className="w-6 h-6" />,
      content: "Royalbird Studios respects intellectual property rights. If you believe your work has been copied in a way that constitutes copyright infringement, please contact us with detailed information. We will promptly investigate claims of copyright infringement."
    },
    {
      title: "Limitation of Liability",
      icon: <AlertCircle className="w-6 h-6" />,
      content: "Royalbird Studios shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of our services. Our total liability shall not exceed the amount paid by you, if any, for accessing our services."
    },
    {
      title: "Governing Law",
      icon: <FileText className="w-6 h-6" />,
      content: "These Terms shall be governed by the laws of Nigeria. Any disputes shall be resolved through arbitration in Abuja, Nigeria, in accordance with Nigerian arbitration laws."
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 opacity-10">
            <Shield size={100} className="text-blue-400" />
          </div>
          <div className="absolute bottom-20 right-20 opacity-10">
            <BookOpen size={80} className="text-purple-400" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">LEGAL DOCUMENTS</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">
              Terms of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service</span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8" />

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using Royalbird Studios&apos; website, comics, or services.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 text-slate-500">
              <span className="text-sm">Last updated:</span>
              <span className="font-semibold">{lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-16">
              <p className="text-slate-700 leading-relaxed">
                Welcome to Royalbird Studios. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, 
                comics, animations, and related services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={index} className="group">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-slate-800 mb-4">
                        {index + 1}. {section.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Terms */}
            <div className="mt-20 bg-gradient-to-r from-blue-100/80 to-purple-100/50 rounded-3xl p-8 border border-blue-200/50">
              <h3 className="text-2xl font-black text-slate-800 mb-6">
                Additional Terms
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Account Termination</h4>
                  <p className="text-slate-600 text-sm">
                    We reserve the right to terminate or suspend your account for any violation of these Terms.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Service Modifications</h4>
                  <p className="text-slate-600 text-sm">
                    We may modify or discontinue our services at any time without notice.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Third-Party Links</h4>
                  <p className="text-slate-600 text-sm">
                    Our service may contain links to third-party websites not controlled by Royalbird Studios.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Age Requirement</h4>
                  <p className="text-slate-600 text-sm">
                    Our services are intended for users who are at least 13 years of age.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
              <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-r from-blue-100/80 to-purple-100/50 border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h4 className="text-xl font-black text-slate-800">
                  Questions About Our Terms?
                </h4>
                <p className="text-slate-600 max-w-md">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <a 
                  href="mailto:legal@royalbirdstudios.com" 
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  legal@royalbirdstudios.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}