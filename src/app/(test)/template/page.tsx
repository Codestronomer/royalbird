import Frame1 from '../../../../public/Frame1.svg';
import Aura from "../../../../public/Frame132.svg";
import Image from 'next/image';
import { League_Spartan } from 'next/font/google';

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: '--font-league-sans',
})

const TemplatePage = () => {
  return (
    <main className="min-h-screen">
      <div className={`${leagueSpartan.className} relative flex flex-col gap-2 justify-center mx-auto`}>
        <img src='https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCc6V5gFWdPrB3EAfHZT7QdFGjt8zKieNam2I6' alt="Frame 1" height={400} width={400} className="mb-0 w-full" />
        <div className="p-8">
          <h2 className="font-bold text-3xl">Log into My Aura </h2>
          <p>Hey there,</p>
          <p>Click the button below to sign in to your account. This link expires in 10 minutes.</p>
          <a className="text-blue-700 underline pointer" href="https://myaura.com/login">Log in</a>
          <p>Or copy and paste this link into your browser:</p>
          <a className="text-blue-700 underline pointer" href="https://myaura.com/login">https://myaura.com/login</a>
          <p>If you didn&apos;t request this, you can safely ignore this email.</p>
          <p>Keep vibing,</p>
          <p>The MyAura Team</p>
        </div>
        <div className="flex flex-col justify-center items-center text-center gap-8">
          <div>
            <img src='https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZC6kkkPYsl7twzm8iK0vuXqofxMPFZjlkcDaAd' alt="Frame 132" className="max-h-[80px]" />
          </div>
          <div>
            <p>Connecting authentic vibes worldwide</p>
            <p>© 2025 My Aura</p>
            <p>Silicon Valley, San Francisco, CA</p>
            <p>www.myauraapp.com</p>
            <p><a>Help Center</a></p>
            <p><a>Privacy Policy</a></p>
            <p>Don&apos;t want these emails anymore? You can <a href="">Unsubscribe</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
export default TemplatePage;