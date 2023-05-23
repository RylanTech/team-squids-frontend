import axios from "axios";
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";

export interface Church {
  churchId: number;
  userId: number;
  churchName: string;
  denomination: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  churchEmail: string;
  welcomeMessage: string;
  serviceTime: string;
  imageUrl: string;
  website: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface newChurch {
  userId: number;
  churchName: string;
  denomination: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  churchEmail: string;
  welcomeMessage: string;
  serviceTime: string;
  imageUrl: string;
  website: string;
}

interface ChurchContextProps {
  churches: Church[];
  setChurches: Dispatch<SetStateAction<Church[]>>;
  getAllChurches: () => Promise<void>;
  createChurch: (newChurch: newChurch) => Promise<newChurch>;
  getChurch: (churchId: number) => Promise<Church>;
  updateChurch: (updatedChurch: Church) => Promise<Church>;
  deleteChurch: (churchId: number) => Promise<Church>;
}

interface ChurchContextProviderProps {
  children: ReactNode;
}

export const ChurchContext = createContext<ChurchContextProps>({
  churches: [],
  setChurches: () => {},
  getAllChurches: () => Promise.resolve(),
  createChurch: (newChurch: newChurch) => Promise.resolve(newChurch),
  getChurch: (churchId: number) => Promise.resolve({} as Church),
  updateChurch: (updatedChurch: Church) => Promise.resolve(updatedChurch),
  deleteChurch: (churchId: number) => Promise.resolve({} as Church),
});

const BASE_URL = "http://localhost:3000/api/church/";

export const ChurchProvider = ({ children }: ChurchContextProviderProps) => {
  const [churches, setChurches] = useState<Church[]>([]);

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

  const createChurch = async (newChurch: newChurch) => {
    try {
      const response = await axios.post(BASE_URL, newChurch);
      await getAllChurches();
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const getChurch = async (churchId: number) => {
    const churchIdURL = `${BASE_URL}${churchId}`;
    try {
      const response = await axios.get(churchIdURL);
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const updateChurch = async (updatedChurch: Church) => {
    const churchIdURL = `${BASE_URL}${updatedChurch.churchId}`;
    try {
      const response = await axios.put(churchIdURL, updatedChurch);
      await getAllChurches();
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const deleteChurch = async (churchId: number) => {
    const churchIdURL = `${BASE_URL}${churchId}`;
    try {
      const response = await axios.delete(churchIdURL);
      await getAllChurches();
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  return (
    <ChurchContext.Provider
      value={{
        churches,
        setChurches,
        getAllChurches,
        createChurch,
        getChurch,
        updateChurch,
        deleteChurch,
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};