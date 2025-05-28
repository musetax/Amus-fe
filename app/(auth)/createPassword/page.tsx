"use client";
import MainLogo from "public/images/newAuth/main-logo.svg";
import WelcomeFrontImg from "public/images/newAuth/forgot-front-img.png";
import AuthView from "@/components/common/authView";
import CreatePasswordForm from "./createPasswordFrom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
const CreatePasswordLayout = () => {
  const navigate = useRouter();

  const passwordValidations = {
    hasLowercase: true,
    hasUppercase: false,
    hasNumber: true,
    hasSpecialChar: false,
    isMinLength: true,
  };
  const handleCreatePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate.push("/signin");
  };
  return (
    <>
      <div className="flex flex-wrap md:flex-nowrap bg-white">
        <div className="w-full xl:w-1/2 hidden xl:block">
          <AuthView
            title="Welcome"
            desc="Your trusted platform
          for seamless administration and security."
            imgSrc={WelcomeFrontImg}
          />
        </div>
        <div className="w-full xl:w-1/2 px-4 pt-5 xl:px-20 xl:pt-16 pb-10">
          <div className="flex items-center justify-between w-full">
            <Link href="/">
              <Image src={MainLogo} width={152} height={40} alt="icon" />
            </Link>
          </div>

          <div className="flex items-center justify-center  max-w-[560px] mx-auto xl:ml-0 mt-10 xl:mt-[80px]">
            <div className="bg-white py-8 rounded-lg w-full">
              <h1 className="text-2xl xl:text-[40px] xl:leading-[44px] font-semibold text-cyanBlue mb-2">
                Create new password
              </h1>
              <p className="text-textgray text-lg mb-6">
                Your new passwords must be different from previous used
                Passwords
              </p>

              {/* <form className="space-y-4"> */}
              <CreatePasswordForm />
              <div className="block mt-6">
                <Link href="/signin" className="inline-block">
                  <div className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent  font-medium text-base   flex items-center justify-start gap-1">
                    <ArrowLeft />
                    Back to Login
                  </div>
                </Link>
              </div>
              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePasswordLayout;
