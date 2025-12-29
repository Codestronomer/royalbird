// app/privacy/page.tsx
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  Cookie, 
  Mail, 
  Users,
  Database,
  Bell,
  Globe
} from 'lucide-react'

export default function PrivacyPage() {
  const lastUpdated = "December 8, 2025"
  
  const dataTypes = [
    {
      icon: <Mail className="w-5 h-5" />,
      type: "Contact Information",
      description: "Email addresses, names when you contact us"
    },
    {
      icon: <Users className="w-5 h-5" />,
      type: "Usage Data",
      description: "Pages visited, time spent, click patterns"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      type: "Device Information",
      description: "Browser type, IP address, operating system"
    },
    {
      icon: <Cookie className="w-5 h-5" />,
      type: "Cookies Data",
      description: "Session cookies, preference cookies, security cookies"
    }
  ]

  const principles = [
    {
      title: "Transparency",
      description: "We clearly explain what data we collect and why",
      icon: <Eye className="w-6 h-6" />
    },
    {
      title: "Minimal Collection",
      description: "We only collect data necessary for our services",
      icon: <Database className="w-6 h-6" />
    },
    {
      title: "Security First",
      description: "Your data is protected with industry-standard security",
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: "Your Control",
      description: "You have rights to access, modify, or delete your data",
      icon: <Shield className="w-6 h-6" />
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 opacity-10">
            <Lock size={100} className="text-blue-400" />
          </div>
          <div className="absolute bottom-20 left-20 opacity-10">
            <Shield size={80} className="text-purple-400" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-3 mb-8">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">YOUR PRIVACY MATTERS</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6">
              Privacy <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8" />

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              How we collect, use, and protect your personal information at Royalbird Studios.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 text-slate-500">
              <span className="text-sm">Last updated:</span>
              <span className="font-semibold">{lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800 mb-12 text-center">
              Our Privacy <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Principles</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {principles.map((principle, index) => (
                <div key={index} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {principle.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-slate-600">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800 mb-12 text-center">
              Data We <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Collect</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {dataTypes.map((data, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {data.icon}
                    </div>
                    <h3 className="font-bold text-slate-800">{data.type}</h3>
                  </div>
                  <p className="text-slate-600 text-sm">
                    {data.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 leading-relaxed">
                We collect this data to improve your experience, provide better services, and communicate with you about updates, 
                new releases, and important announcements. We never sell your personal data to third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-15 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* How We Use Data */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Server className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-800">How We Use Your Data</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "To provide and maintain our services",
                  "To notify you about changes to our services",
                  "To provide customer support",
                  "To gather analysis for service improvement",
                  "To monitor service usage",
                  "To detect, prevent, and address technical issues"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cookies */}
            <div id="cookies">
              <div className="flex items-center gap-3 mb-6">
                <Cookie className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-black text-slate-800">Cookies Policy</h3>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <p className="text-slate-700 mb-4">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
                  Cookies are files with small amount of data which may include an anonymous unique identifier.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">Essential</div>
                    <div className="text-sm text-slate-600">Required for site functionality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">Performance</div>
                    <div className="text-sm text-slate-600">Helps improve user experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">Analytics</div>
                    <div className="text-sm text-slate-600">Understanding user behavior</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-black text-slate-800">Your Data Protection Rights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { right: "Right to Access", desc: "Request copies of your personal data" },
                  { right: "Right to Rectification", desc: "Request correction of inaccurate data" },
                  { right: "Right to Erasure", desc: "Request deletion of your personal data" },
                  { right: "Right to Object", desc: "Object to our processing of your data" }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                    <h4 className="font-bold text-slate-800 mb-2">{item.right}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Updates */}
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-3xl p-8 border border-blue-200/50">
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-800 mb-4">Contact Us</h3>
                <p className="text-slate-700 mb-6">
                  If you have any questions about this Privacy Policy, please contact our Data Protection Officer:
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:privacy@royalbirdstudios.com" 
                    className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    privacy@royalbirdstudios.com
                  </a>
                  <p className="text-sm text-slate-600">
                    Loku Womu Street, 8th Avenue, Ibile, Abuja, Nigeria
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-blue-200/50 text-center">
                <p className="text-slate-600 text-sm">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the &quot;last updated&quot; date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}