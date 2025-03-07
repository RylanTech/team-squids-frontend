import axios from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ChurchUser, ChurchUserContext, authHeader } from "./churchUserContext";
import { AllEvents } from "./eventContext";
import Location from "../interfaces/Location";

export interface Church {
  churchId: number;
  userId: number;
  churchName: string;
  denomination: string;
  location: Location;
  phoneNumber: string;
  churchEmail: string;
  welcomeMessage: string;
  serviceTime: string;
  imageUrl: string;
  website: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChurchWithEvents {
  churchId: number;
  userId: number;
  churchName: string;
  denomination: string;
  location: Location;
  phoneNumber: string;
  churchEmail: string;
  welcomeMessage: string;
  serviceTime: string;
  imageUrl: string;
  website: string;
  Events?: AllEvents[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewChurch {
  userId: number;
  churchName: string;
  denomination: string;
  location: Location;
  phoneNumber: string;
  churchEmail: string;
  welcomeMessage: string;
  serviceTime: string;
  imageUrl: string;
  website: string;
}

export interface AllChurches extends Church {
  ChurchUser: ChurchUser;
}

export interface OneChurch extends Church {
  Events: AllEvents[];
  ChurchUser: ChurchUser;
}

interface ChurchContextProps {
  churches: AllChurches[];
  favoriteChurches: AllChurches[];
  getFavChurches: () => Promise<void>;
  setChurches: Dispatch<SetStateAction<AllChurches[]>>;
  getAllChurches: () => Promise<void>;
  createChurch: (newChurch: NewChurch) => Promise<NewChurch>;
  getChurch: (churchId: number) => Promise<OneChurch>;
  updateChurch: (updatedChurch: Church) => Promise<Church>;
  deleteChurch: (churchId: number) => Promise<Church>;
  searchChurches: (query: string) => Promise<void>;
}

interface ChurchContextProviderProps {
  children: ReactNode;
}

export const ChurchContext = createContext<ChurchContextProps>({
  churches: [],
  favoriteChurches: [],
  getFavChurches: () => Promise.resolve(),
  setChurches: () => { },
  getAllChurches: () => Promise.resolve(),
  createChurch: (newChurch: NewChurch) => Promise.resolve(newChurch),
  getChurch: (churchId: number) => Promise.resolve({} as OneChurch),
  updateChurch: (updatedChurch: Church) => Promise.resolve(updatedChurch),
  deleteChurch: (churchId: number) => Promise.resolve({} as Church),
  searchChurches: (query: string) => Promise.resolve(),
});

const BASE_URL = "https://churchhive.net/api/church/";
// const BASE_URL = "http://localhost:3001/api/church/";


export const ChurchProvider = ({ children }: ChurchContextProviderProps) => {
  const [churches, setChurches] = useState<AllChurches[]>([]);
  const [favoriteChurches, setFavoriteChurches] = useState<AllChurches[]>([]);
  const { currentUserId, getChurchUser } = useContext(ChurchUserContext);

  const getAllChurches = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setChurches(response.data);
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  useEffect(() => {
    (async () => {
      await getAllChurches();
    })();
  }, []);

  const createChurch = async (newChurch: NewChurch) => {
    try {
      const response = await axios.post(BASE_URL, newChurch, {
        headers: authHeader(),
      });
      await Promise.all([getAllChurches(), getChurchUser(currentUserId)]);
      return response.data;
    } catch (error: any) {
      // throw error.response.statusText;
      return
    }
  };

  const getChurch = async (churchId: number) => {
    const churchIdURL = `${BASE_URL}${churchId}`;
    try {
      const response = await axios.get(churchIdURL);
      return await response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const getFavChurches = async () => {
    const favorites = localStorage.getItem("favoriteChurches");
    if (favorites) {
      if (favorites.length !== 2) {
        let favoritesArray = JSON.parse(favorites)
        const favURL = `${BASE_URL}favorites/`;
        try {
          const response = await axios.post(favURL, { ids: favoritesArray });
          setFavoriteChurches(response.data);
          return await response.data;
        } catch (error: any) {
          throw error.response.statusText;
        }
      } else {
        return "No Favorite Churches"
      }
    } else {
      return "No Favorite Churches"
    }

  };

  const updateChurch = async (updatedChurch: Church) => {
    const churchIdURL = `${BASE_URL}${updatedChurch.churchId}`;
    try {
      const response = await axios.put(churchIdURL, updatedChurch, {
        headers: authHeader(),
      });
      await Promise.all([getAllChurches(), getChurchUser(currentUserId)]);
      return await response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const deleteChurch = async (churchId: number) => {
    const churchIdURL = `${BASE_URL}${churchId}`;
    try {
      const response = await axios.delete(churchIdURL, {
        headers: authHeader(),
      })
      await Promise.all([getAllChurches(), getChurchUser(currentUserId)]);
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const searchChurches = async (query: string) => {
    if (query === "") {
      return
    }
    const searchChurchUrl = `${BASE_URL}search/${query}`
    try {
      const response = await axios.get(searchChurchUrl);
      setChurches(response.data);
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  useEffect(() => {
    (async () => {
      await searchChurches('');
    })();
  }, []);

  return (
    <ChurchContext.Provider
      value={{
        churches,
        favoriteChurches,
        getFavChurches,
        setChurches,
        getAllChurches,
        createChurch,
        getChurch,
        updateChurch,
        deleteChurch,
        searchChurches,
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};
