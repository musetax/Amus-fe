"use client";
import AuthView from "@/components/common/authView";
import MainLogo from "public/images/newAuth/main-logo.svg";
import WelcomeFrontImg from "public/images/newAuth/welcome-img.png";
import LoginForm from "./loginForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useState } from "react";
import RightArrow from "@/public/icon/rightArrow";
import GoogleIcon from "@/public/icon/google-icon";
const SignInLayout = () => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate.push("/signup");
  };
  const handleSigninWithGoogle = async () => {
    setLoading(true);
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap bg-white">
      <div className="w-full md:w-1/2 hidden xl:block">
        <AuthView
          title="Welcome"
          desc="Your trusted platform
          for seamless administration and security."
          imgSrc={WelcomeFrontImg}
        />
      </div>
      <div className="w-full xl:w-1/2 px-4 pt-5 xl:px-20 xl:pt-20 pb-10">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <Image src={MainLogo} alt="icon" />
          </Link>
          <button
            onClick={handleClick}
            className="bg-btnBgGradient py-2 px-4 rounded-lg"
          >
            <span className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent rounded-lg text-base font-medium flex items-center gap-1 text-primary">
              Sign Up <RightArrow />
            </span>
          </button>
        </div>

        <div className="flex items-center  max-w-[560px] mx-auto xl:ml-0 justify-center mt-10 md:mt-[80px]">
          <div className="bg-white py-8 rounded-lg w-full">
            <div className="mb-10">
              <h1 className="text-2xl text-gray-700 xl:text-[40px] xl:leading-[44px] font-semibold text-cyanBlue mb-2">
                Sign In
              </h1>
              <p className="text-textgray text-base xl:text-lg mb-6">
                Please login to continue to your account.
              </p>
            </div>
            <LoginForm />

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-grow border-t border-linegray"></div>
              <span className="px-3 text-textgray text-lg">or</span>
              <div className="flex-grow border-t border-linegray"></div>
            </div>
            <button
              type="button"
              className="w-full font-medium text-base xl:text-lg gap-2 flex h-[54px] items-center justify-center bg-white border border-lightgray text-textgray py-2 px-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={handleSigninWithGoogle}
            >
              <GoogleIcon />
              {loading ? "Loading.." : " Sign in with Google"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInLayout;
