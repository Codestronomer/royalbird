import Frame1 from '../../../../public/Frame1.svg';
import Aura from "../../../../public/Frame132.svg";
import Image from 'next/image';

const TemplatePage = () => {
  return (
    <div className='flex self-center justify-center w-[80%]'>
      <Image src={Frame1} alt="Frame 1" height={400} width={400} />
      <h2>Log into My Aura </h2>
      <Image src={Aura} alt="Frame 132" />
    </div>
  );
}
export default TemplatePage;