import MainLogo from "public/images/newAuth/main-logo.svg";
import WelcomeFrontImg from "public/images/newAuth/forgot-front-img.png";
import AuthView from "@/components/common/authView";
import Link from "next/link";
import ForgotForm from "./forgotForm";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
const ForgetPasswordLayout = () => {
  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap bg-white">
        <div className="w-full  xl:w-1/2 hidden xl:block">
          <AuthView
            title="Welcome"
            desc="Your trusted platform
          for seamless administration and security."
            imgSrc={WelcomeFrontImg}
          />
        </div>
        <div className="w-full xl:w-1/2 px-4 py-5 xl:p-20">
          <div className="flex items-center justify-between w-full">
            <Link href="/">
              <Image src={MainLogo} width={152} height={40} alt="icon" />
            </Link>
          </div>

          <div className="flex items-center justify-center  max-w-[560px] mx-auto xl:ml-0 mt-[80px] bg-white">
            <div className="bg-white py-8 rounded-lg w-full">
              <div className="mb-12">
                <h1 className="text-2xl xl:text-[40px] xl:leading-[44px] font-semibold text-cyanBlue mb-2">
                  Forgot Password?
                </h1>
                <p className="text-textgray text-base xl:text-lg mb-6">
                  Don't worry, we'll help you reset your password.
                </p>
              </div>
              <ForgotForm />
              <div className="block mt-12">
                <Link href="/signin" className="inline-block">
                  <div className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent  font-medium text-base   flex items-center justify-start gap-1">
                    <ArrowLeft />
                    Back to Login
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordLayout;
