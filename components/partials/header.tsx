"use client";
import Image from "next/image";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  User,
} from "@heroui/react";
import { MdClose, MdLogout } from "react-icons/md";
import { ChevronDown, MenuIcon } from "lucide-react";
import Logo from "public/images/logo/main-logo.svg";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { clearUserData } from "@/redux/slice/authSlice";
import { useRouter } from "next/navigation";

const HeaderBar: React.FC<any> = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(user, "useruser");
  const dispatch = useDispatch();
  const handleLogout = async () => {
    localStorage.clear();
    dispatch(clearUserData(""));
    document.cookie = "collintoken=; path=/; expires=0;";
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    router.push("/login");
  };

  const handleUserProfile = async () => {
    router.push("/user-profile");
  };

  useEffect(() => {
    if (user?.profile?.email) {
      localStorage.setItem("chat_email", user?.profile?.email);
    }
  }, [user]);

  return (
    <>
      <div className="w-full py-3 bg-lightGray">
        <div className="px-4 xl:px-20 container-custom">
          <Navbar
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            classNames={{
              base: "bg-transparent backdrop-blur-none relative custom-backdrop-saturate",
              wrapper: "w-full max-w-full px-0",
              item: ` font-normal text-base text-black dropdown-menu`,
              menuItem: ``,
            }}
          >
            {/* Brand and toggle */}
            <div>
              <Link href="/">
                <Image
                  src={Logo}
                  alt="Paragon Gents"
                  width={280}
                  height={30}
                  className="w-[120px] min-w-[120px] dark:hidden"
                />
              </Link>
            </div>

            <NavbarContent className="lg:hidden" justify="end">
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="text-white text-2xl"
                icon={isMenuOpen ? <MdClose /> : <MenuIcon />}
              />
            </NavbarContent>

            {/* Desktop menu */}
            <NavbarContent className="hidden lg:flex gap-5 " justify="center">
              <NavbarItem>
                <Link href="/dashboard">Dashboard</Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="#">Financial Goals</Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/user-profile">Settings</Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="#">Support</Link>
              </NavbarItem>
            </NavbarContent>

            {/* Mobile menu content */}
            <NavbarMenu className="bg-primaryColor pt-10 gap-5">
              <NavbarMenuItem>
                <Link href="#">Dashboard</Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="#">Financial Goals</Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="#">Settings</Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link href="#">Support</Link>
              </NavbarMenuItem>
            </NavbarMenu>

            <div className="flex items-center gap-4">
              <Dropdown
                placement="bottom-start"
                className="dark:bg-lightBlue bg-white dark:btn-hover"
              >
                <DropdownTrigger>
                  <User
                    as="button"
                    className="border-none user_img flex items-center"
                    name={
                      <span className="text-base font-normal break-all flex items-center gap-2 text-primaryColor">
                        {user?.profile?.first_name} {user?.profile?.last_name}
                        <ChevronDown />
                      </span>
                    }
                  />
                </DropdownTrigger>

                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem key="profile" onClick={handleUserProfile}>
                    <span className="flex items-center gap-2.5">
                      <MdLogout className="text-xl" /> User Profile
                    </span>
                  </DropdownItem>

                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    <span className="flex items-center gap-2.5">
                      <MdLogout className="text-xl" /> Log Out
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Navbar>
        </div>
      </div>
    </>
  );
};

export default HeaderBar;
