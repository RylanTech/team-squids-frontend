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
import { AllChurches, Church } from "./churchContext";
import Location from "../interfaces/Location";
import { ChurchUserContext, authHeader } from "./churchUserContext";

export interface Event {
  eventId: number;
  churchId: number;
  eventTitle: string;
  date: string;
  endDate: string | null 
  location: Location;
  eventAudience: string;
  eventType:
    | "Family"
    | "Youth"
    | "Young Adults"
    | "Single"
    | "Womans"
    | "Mens"
    | "Senior";
  description: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewEvent {
  churchId: number;
  eventTitle: string;
  date: string;
  endDate: string | null;
  location: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  eventType:
    | "Family"
    | "Youth"
    | "Young Adults"
    | "Single"
    | "Womans"
    | "Mens"
    | "Senior"
    | "";
  eventAudience: string;
  description: string;
  imageUrl: string;
}
export interface UpdateEvent extends Event {
  userId: number;
}

export interface AllEvents extends Event {
  Church: AllChurches;
}

export interface OneEvent extends Event {
  Church: Church;
}

export interface TriggerInfo {
  body: string;
  title: string;
  dayBefore: boolean;
  weekBefore: boolean;
}

interface EventContextProps {
  events: AllEvents[];
  userEvents: AllEvents[];
  setEvents: Dispatch<SetStateAction<AllEvents[]>>;
  getAllEvents: () => Promise<void>;
  postImage: (formData: any) => Promise<any>;
  getAllUserEvents: () => Promise<void>;
  createEvent: (newEvent: NewEvent, triggerInfo: TriggerInfo) => Promise<NewEvent>;
  getEvent: (eventId: number) => Promise<OneEvent>;
  updateEvent: (updatedEvent: Event) => Promise<Event>;
  deleteEvent: (eventId: number) => Promise<Event>;
  searchEvents: (query: string) => Promise<void>;
}

interface EventContextProviderProps {
  children: ReactNode;
}

export const EventContext = createContext<EventContextProps>({
  events: [],
  userEvents: [],
  setEvents: () => {},
  getAllEvents: () => Promise.resolve(),
  postImage: (formData: any) => Promise.resolve(),
  getAllUserEvents: () => Promise.resolve(),
  createEvent: (newEvent: NewEvent) => Promise.resolve(newEvent),
  getEvent: (eventId: number) => Promise.resolve({} as OneEvent),
  updateEvent: (updatedEvent: Event) => Promise.resolve(updatedEvent),
  deleteEvent: (eventId: number) => Promise.resolve({} as Event),
  searchEvents: (query: string) => Promise.resolve()
});

const BASE_URL = "https://churchhive.net/api/event/";
// const BASE_URL = "http://localhost:3001/api/event/";

export const EventProvider = ({ children }: EventContextProviderProps) => {
  const [events, setEvents] = useState<AllEvents[]>([]);
  const [userEvents, setUserEvents] = useState<AllEvents[]>([]);
  const { currentUserId } = useContext(ChurchUserContext);

  const getAllEvents = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setEvents(response.data);
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  useEffect(() => {
    (async () => {
      await getAllEvents();
    })();
  }, []);

  const getAllUserEvents = async () => {
    const UserEventsURL = `${BASE_URL}userevent/${currentUserId}`;
    try {
      const response = await axios.get(UserEventsURL);
      setUserEvents(response.data);
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  useEffect(() => {
    (async () => {
      await getAllUserEvents();
    })();
  }, [currentUserId]);

  const postImage = async (formData: any) => {
    try {
      const response = await axios.post(`${BASE_URL}upload-image/`, formData, {
        headers: authHeader()
      });
      return response.data
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const createEvent = async (newEvent: NewEvent, triggerInfo: TriggerInfo) => {
    try {
      const response = await axios.post(BASE_URL, { newEvent, triggerInfo }, {
        headers: {
          ...authHeader(),
          'request-body-version': 'v4',
        },
      });
      await Promise.all([getAllEvents(), getAllUserEvents()]);
      return response.data;
    } catch (error: any) {
      return
    }
  };

  const getEvent = async (eventId: number) => {
    const eventIdURL = `${BASE_URL}${eventId}`;
    try {
      const response = await axios.get(eventIdURL, { headers: authHeader() });
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    const eventIdURL = `${BASE_URL}editevent/${updatedEvent.eventId}`;
    try {
      const response = await axios.put(eventIdURL, updatedEvent, {
        headers: authHeader(),
      });
      await Promise.all([getAllEvents(), getAllUserEvents()]);
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const deleteEvent = async (eventId: number) => {
    const eventIdURL = `${BASE_URL}${eventId}`;
    try {
      const response = await axios.delete(eventIdURL, {
        headers: authHeader(),
      });
      await Promise.all([getAllEvents(), getAllUserEvents()]);
      return response.data;
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  const searchEvents = async (query: string) => {
    if (query === "") {
      return;
    }
    const searchEventUrl = `${BASE_URL}search/${query}`;
    try {
      const response = await axios.get(searchEventUrl);
      setEvents(response.data);
    } catch (error: any) {
      throw error.response.statusText;
    }
  };

  useEffect(() => {
    (async () => {
      await searchEvents("");
    })();
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        userEvents,
        postImage,
        setEvents,
        getAllEvents,
        getAllUserEvents,
        createEvent,
        getEvent,
        updateEvent,
        deleteEvent,
        searchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
