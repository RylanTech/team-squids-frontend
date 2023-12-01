import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "../context/eventContext";
import EventsList from "../components/Events/EventsLists";
import { trashBin } from "ionicons/icons";
import SecondEventsList from "../components/Events/SecondEventList";

const EventFinder: React.FC = () => {
  const { events, searchEvents, getAllEvents } = useContext(EventContext);
  const [width, setWidth] = useState<number>()

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    // Function to update the screenWidth state
    const updateScreenWidth = () => {
      setWidth(window.innerWidth);
    };

    // Attach the event listener to window resize
    window.addEventListener('resize', updateScreenWidth);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  const handleSearch = async (searchQuery: string) => {
    // Call function to search locations base on query
    await searchEvents(searchQuery)
  };

  const handleClear = async () => {
    await getAllEvents();
  }

  function eventFront() {
    if (width) {
      if (width > 768) {
        return (
          <>
            <IonRow>
              <SecondEventsList events={events}/>
            </IonRow>
            
          </>
        )
      } else {
        return (
          <IonCol size="12">
            <EventsList events={events} />
          </IonCol>
        )
      }
    } else {
      return (
        <>Error, Couldn't detect screen width.</>
      )
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Event Finder</IonTitle>
        </IonToolbar>
        <IonToolbar color="primary">
          <IonSearchbar
            onIonChange={(e) => handleSearch(e.detail.value!)}
            onIonClear={handleClear}
            clearIcon={trashBin}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {eventFront()}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EventFinder;
