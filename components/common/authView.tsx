import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import BoostIcon from "public/images/newAuth/boostIcon.svg";

interface authProps {
  title: string;
  desc: string;
  imgSrc: StaticImport | string;
  imgPosition?: string;
  positionRight?: string;
  positionLeft?: string;
  positionBottom?: string;
  positionTop?: string;
  imgWidth?: string;
  imgHeight?: string;
}
const AuthView: React.FC<authProps> = ({
  title,
  desc,
  imgSrc,
  imgPosition,
  positionRight,
  positionTop,
}) => {
  return (
    <div className="bg-authGradientBg relative after:bg-topRightCircel after:absolute after:top-0 after:right-0 after:w-[325px] after:h-[265px] before:bg-bottomLeftCircel before:absolute before:bottom-0 before:left-0 before:w-[340px] before:h-[250px]  min-h-screen h-full p-20">
      <div className="bg-authViewBg backdrop-blur-xl max-w-[560px]  2xl:max-w-[700px] mx-auto relative z-20 rounded-3xl">
        <div className="block pt-12 pl-12">
          <h2 className="font-semibold text-[2.5rem] text-white">{title}</h2>
          <div className="text-lg w-[250px] font-normal text-white border-l border-l-white leading-7 border-opacity-30 pl-4 py-2">
            {desc}
          </div>
        </div>
        <div className="flex relative">
          <div className="block relative -left-10 mt-10 ">
            <Image
              src={BoostIcon}
              width={238}
              height={223}
              className="min-w-[220px] h-auto"
              alt="icon"
            />
          </div>
          <div
            className={`${imgPosition} ${
              imgPosition && "top-[-43px] right-[-30px]"
            }`}
          >
            <div className={`block  relative -right-6 2xl:-right-3 `}>
              <Image src={imgSrc} className={``} alt="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthView;
