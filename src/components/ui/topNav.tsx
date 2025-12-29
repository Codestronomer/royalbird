import Image from "next/image"
import { Button } from "./button"

export default function TopNav() {
  const logoUrl = "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCbpaNxYJTjwQiehyaprgucNE83TskxCXJonmI"

  return (
    <nav className="flex items-center justify-between w-full p-4 text-xl font-semibold">
      <Image 
        src={logoUrl}
        style={{objectFit: "contain"}} 
        alt="royal bird studios"
        width={120}
        height={40}
      />
     <div className="flex items-center justify-around gap-5">
          <Button variant="outline">LOG IN</Button>
      </div>
    </nav>
  )
}
