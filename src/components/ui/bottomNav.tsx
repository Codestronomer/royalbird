import { BookOpen, Home, Newspaper, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: '/',
      active: pathname === '/'
    },
    { 
      icon: BookOpen, 
      label: 'Comics', 
      path: '/comics',
      active: pathname === '/comics' || pathname.startsWith('/comics/')
    },
    // { 
    //   icon: Search, 
    //   label: 'Discover', 
    //   path: '/discover',
    //   active: pathname === '/discover'
    // },
    { 
      icon: Newspaper, 
      label: 'Blog', 
      path: '/blog',
      active: pathname.startsWith('/blog')
    },
    { 
      icon: User, 
      label: 'About Us', 
      path: '/about',
      active: pathname === '/about'
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-between w-fit bg-white/95 backdrop-blur-md rounded-full p-3 text-xl font-semibold shadow-2xl border border-gray-300/50 z-50">
      <div className="flex items-center justify-around gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`relative p-3 rounded-full transition-all duration-300 group ${
                item.active 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              aria-label={item.label}
            >
              <Icon 
                size={22} 
                className={`transition-transform duration-300 ${
                  item.active ? 'scale-110' : 'group-hover:scale-105'
                }`} 
              />
              
              {/* Active indicator dot */}
              {item.active && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2 border-purple-600" />
              )}
              
              {/* Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                {item.label}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  )
}