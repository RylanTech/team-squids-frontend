import axios, { AxiosResponse } from "axios";
import jwt_decode from "jwt-decode";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { OneChurch } from "./churchContext";

export interface ChurchUser {
  userId: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface NewChurchUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface OneArticle {
  title: string,
  body: string,
  createdAt: Date,
  updatedAt: Date,
  ArticleId: number
}

export interface Articles extends OneArticle {
  OneArticle: OneArticle[]
}

export interface LoginChurchUser {
  email: string;
  password: string;
}

export interface OneChurchUser extends ChurchUser {
  Churches: OneChurch[];
}

interface decoded {
  userId: number;
  iat: number;
  exp: number;
}

interface ChurchUserContextProps {
  currentUserId: number;
  apiKey: any;
  getApiKey: () => Promise<void>;
  setCurrentUserId: Dispatch<SetStateAction<number>>;
  verifyCurrentUser: () => Promise<decoded | null>;
  createChurchUser: (newUser: NewChurchUser) => Promise<NewChurchUser>;
  getArticles: () => Promise<void>;
  getArticle: (articleId: number) => Promise<void>
  getChurchUser: (userId: number) => Promise<OneChurchUser>;
  updateChurchUser: (updatedUser: ChurchUser) => Promise<ChurchUser>;
  deleteChurchUser: (userId: number) => Promise<void>;
  loginChurchUser: (churchUser: LoginChurchUser) => Promise<any>;
  logoutChurchUser: () => Promise<void>;
  checkCurrentUser: (userId: string) => Promise<any>;
  isLoggedIn: boolean;
}

interface ChurchUserContextProviderProps {
  children: ReactNode;
}

export const ChurchUserContext = createContext<ChurchUserContextProps>({
  currentUserId: 0,
  apiKey: "apiKey",
  getApiKey: () => Promise.resolve(), // Update the implementation to return a Promise<string>
  setCurrentUserId: () => { },
  getArticles: () => Promise.resolve(),
  getArticle: () => Promise.resolve(),
  verifyCurrentUser: () => Promise.resolve(null),
  createChurchUser: (newUser: NewChurchUser) => Promise.resolve(newUser),
  getChurchUser: (userId: number) => Promise.resolve({} as OneChurchUser),
  updateChurchUser: (updatedUser: ChurchUser) => Promise.resolve(updatedUser),
  deleteChurchUser: (userId: number) => Promise.resolve(),
  loginChurchUser: (churchUser: LoginChurchUser) => Promise.resolve({}),
  logoutChurchUser: () => Promise.resolve(),
  checkCurrentUser: (userId: string) => Promise.resolve(),
  isLoggedIn: false,
});


const BASE_URL = "https://churchhive.net/api/user/";
// const BASE_URL = "http://localhost:3001/api/user/";

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("myChurchUserToken")}`,
});

export const ChurchUserProvider = ({
  children,
}: ChurchUserContextProviderProps) => {
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiKey, setApiKey] = useState<string>()

  const verifyCurrentUser = async () => {
    const LOGIN_TOKEN = localStorage.getItem("myChurchUserToken");
    if (!LOGIN_TOKEN) {
      setCurrentUserId(0);
      setIsLoggedIn(false);
      return null;
    } else {
      try {
        const verifyUserURL = `${BASE_URL}verify-current-user`;
        const response = await axios.get(verifyUserURL, {
          headers: authHeader(),
        });
        if (response.status === 200) {
          let decoded: decoded = await jwt_decode(LOGIN_TOKEN);
          setCurrentUserId(decoded.userId);
          setIsLoggedIn(true);
          return decoded;
        } else {
          localStorage.removeItem("myChurchUserToken");
          setCurrentUserId(0);
          setIsLoggedIn(false);
          return null;
        }
      } catch (error: any) {
        localStorage.removeItem("myChurchUserToken");
        setCurrentUserId(0);
        setIsLoggedIn(false);
        return null;
      }
    }
  };

  const getApiKey = async (): Promise<void> => {
    try {
      const response = await axios.get("https://churchhive.net/api/key/");
      setApiKey(response.data);
    } catch (error: any) {
      throw error;
    }
  };

  const getArticles = async (): Promise<any> => {
    const getArticlesURL = `https://churchhive.net/api/article/`;
    try {
      const response = await axios.get(getArticlesURL, {
        headers: authHeader()
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const getArticle = async (articleId: number): Promise<void> => {
    const getArticlesURL = `https://churchhive.net/api/article/${articleId}`;
    try {
      const response = await axios.get(getArticlesURL, {
        headers: authHeader()
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };


  // const handlePhoneId = async (phoneId: any) => {
  //   try {
  //     axios.post(BASE_URL + 'deviceid', { phoneId });
  //   } catch (error: any) {
  //     return
  //   }
  // };

  const createChurchUser = async (newUser: NewChurchUser) => {
    const newUserURL = `${BASE_URL}create-account`;
    try {
      const response = await axios.post(newUserURL, newUser);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const getChurchUser = async (userId: number) => {
    const getUserURL = `${BASE_URL}${userId}`;
    try {
      const response = await axios.get(getUserURL);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const updateChurchUser = async (updatedUser: ChurchUser) => {
    const updateUserURL = `${BASE_URL}edit-account/${updatedUser.userId}`;
    try {
      const response = await axios.put(updateUserURL, updatedUser, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const deleteChurchUser = async (userId: number) => {
    const deleteUserURL = `${BASE_URL}delete-account${userId}`;
    try {
      await axios.delete(deleteUserURL, {
        headers: authHeader(),
      });
    } catch (error: any) {
      throw error;
    }
  };

  const loginChurchUser = async (churchUser: LoginChurchUser) => {
    const loginUserURL = `${BASE_URL}signin`;
    try {
      const response = await axios.post(loginUserURL, churchUser);
      if (response.status === 200) {
        localStorage.setItem("myChurchUserToken", response.data.token);
        await verifyCurrentUser();
        setIsLoggedIn(true);
        return response.data;
      } else {
        setIsLoggedIn(false);
        throw new Error("Unable to log in.");
      }
    } catch (error: any) {
      setIsLoggedIn(false);
      // throw new Error(error.response?.data?.message || "Unable to log in.");
      return
    }
  };

  const logoutChurchUser = async () => {
    localStorage.removeItem("myChurchUserToken");
    setCurrentUserId(0);
    setIsLoggedIn(false);
  };

  const checkCurrentUser = async (userId: string) => {
    let id = parseInt(userId);
    if (currentUserId === id) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    verifyCurrentUser();
  }, [loginChurchUser]);

  return (
    <ChurchUserContext.Provider
      value={{
        currentUserId,
        apiKey,
        getApiKey,
        getArticles,
        getArticle,
        setCurrentUserId,
        verifyCurrentUser,
        createChurchUser,
        getChurchUser,
        updateChurchUser,
        deleteChurchUser,
        loginChurchUser,
        logoutChurchUser,
        checkCurrentUser,
        isLoggedIn,
      }}
    >
      {children}
    </ChurchUserContext.Provider>
  );
};
