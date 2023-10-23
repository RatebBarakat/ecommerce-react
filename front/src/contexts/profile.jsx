import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axios";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const fetchProfile = async () => {
    !isProfileLoading && setIsProfileLoading(true);
    axios
      .get("/api/profile")
      .then((response) => {
        setProfile(response.data.data);
      }).catch((error) => {
        console.log('error :>> ', error);
      })
      .finally(() => {
        setIsProfileLoading(false);
      });
  };

  useEffect(() => {
    if (!Object.keys(profile).length > 0) {
      fetchProfile();
    }
  }, []);

  const value = {
    profile,
    setProfile,
    fetchProfile,
    isProfileLoading,
    setIsProfileLoading,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;

};
export {ProfileProvider,ProfileContext};