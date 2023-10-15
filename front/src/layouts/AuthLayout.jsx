import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import Loading from "../components/Loading";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { ProfileContext } from "../contexts/profile";
import Cookies from "js-cookie";

export default function AuthLayout() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const profile = useContext(ProfileContext);
  const [avatar, setAvatar] = useState(null);

  profile.profile &&
    useEffect(() => {
      setAvatar(profile.profile?.avatar);
      avatar && (document.getElementById("avatar").src = avatar);
    }, [profile.profile]);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const logout = async () => {
    if (!Cookies.get("XSRF-TOKEN")) {
      await axios.get("/sanctum/csrf-cookie", {
        withCredentials: "include",
      });
    }
    await auth.logout();
    return navigate("/login");
  };

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (auth.isLoading === false && !auth.user) {
        navigate("/login");
      } else if (auth.isLoading === false && auth.isVerified === false) {
        navigate("/user/verify");
      }
    };
    fetchUserAndRedirect();
  }, [auth.isLoading]);

  if (auth.isLoading) {
    return <Loading centered={true} size={"large"} />;
  }

  return (
    auth.user && (
      <>
        <nav className="w-full mx-auto p-2 flex justify-between bg-indigo-600">
          <Link to="/user/dashboard" className="text-3xl text-white font-bold">
            nav
          </Link>
          {/* <button
            onClick={logout}
            className=" text-indigo-600
    bg-while-600 hover:bg-while-700 focus:ring-4
    focus:outline-none focus:ring-while-300 font-medium
rounded-lg text-sm px-5 py-2.5 text-center
dark:bg-while-600 dark:hover:bg-while-700 dark:focus:ring-while-800"
          >
            logout
          </button> */}
          <div>
            {profile.isProfileLoading && (
              <span className="w-12 h-12 rounded-full animate-spin border-white border-0 !border-l-2"></span>
            )}
            {!profile.isProfileLoading && profile.profile?.avatar && (
              <>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="">
                      <img
                        className="w-12 h-12 rounded-full"
                        src={avatar}
                        alt="Rounded avatar"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/user/profile"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              onClick={logout}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              logout
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            )}
          </div>
        </nav>
        <hr />
        <Outlet />
      </>
    )
  );
}
