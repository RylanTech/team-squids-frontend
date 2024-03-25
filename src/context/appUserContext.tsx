import axios from "axios";
import {
    ReactNode,
    createContext
} from "react";

export interface appUser {
    phoneId: string,
    favArr: number[]
}

interface AppUserContextProps {
    updateAppUser: (userInfo: appUser) => Promise<void>;
}

interface AppUserContextProviderProps {
    children: ReactNode;
}

export const AppUserContext = createContext<AppUserContextProps>({
    updateAppUser: () => Promise.resolve(),
});

const BASE_URL = "https://churchhive.net/api/appuser/";
// const BASE_URL = "http://localhost:3001/api/appuser/";


export const AppUserProvider = ({ children }: AppUserContextProviderProps) => {

    const updateAppUser = async (userInfo: appUser) => {
        try {
            await axios.put(BASE_URL, userInfo);
        } catch (error: any) {
            return
        }
    }

    return (
        <AppUserContext.Provider
            value={{
                updateAppUser
            }}
        >
            {children}
        </AppUserContext.Provider>
    );
};

