import { authKey } from "@/constants/storageKey";
import { decodeToken } from "@/utils/jwt";
import { getFromLocalStorage } from "@/utils/local-storage";

export const isUserLoggedIn = () => {
  return !!getFromLocalStorage(authKey);
};

export const logout = async () => {
  localStorage.removeItem(authKey);
};



export const getUserInfo = () => {
  const authLocalStorageData = getFromLocalStorage(authKey);
  if (authLocalStorageData) {
    return decodeToken(authLocalStorageData) ?? "";
  }
};