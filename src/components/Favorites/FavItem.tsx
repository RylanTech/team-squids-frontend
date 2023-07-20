import React, { useContext } from "react";
import { IonIcon, IonItem, IonLabel, IonList, IonThumbnail } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import { Link } from 'react-router-dom';
import { Church, ChurchWithEvents } from "../../context/churchContext";
import { ChurchUserContext } from "../../context/churchUserContext";
import EventItem from "../Events/EventItem";

interface ContainerProps {
  church: ChurchWithEvents;
}

const FavItem: React.FC<ContainerProps> = ({
  church: {
    churchId,
    userId,
    churchName,
    denomination,
    location: { street, city, state, zip },
    phoneNumber,
    churchEmail,
    welcomeMessage,
    serviceTime,
    imageUrl,
    website,
    Events
  },
}) => {
  const { currentUserId } = useContext(ChurchUserContext);
  
  function FavEventList() {
    if (Events) {
      return Events.map((event) => {
        
        const isoDate = new Date(event.date);
        const formatDate = Intl.DateTimeFormat("en-us", {
          dateStyle: "long",
        });
        const formatDay = Intl.DateTimeFormat("en-us", {
          weekday: "long",
        });
        const formatTime = Intl.DateTimeFormat("en-us", {
          timeStyle: "short",
        });
        const eventDate = formatDate.format(isoDate);
        const eventDay = formatDay.format(isoDate);
        const eventTime = formatTime.format(isoDate);
        
        return (
          <IonItem
            routerLink={`/event/${event.eventId}`}
            button
            detail={userId !== currentUserId}
            key={event.eventId}
          >
            <IonThumbnail slot="start">
              <img alt={event.imageUrl} src={event.imageUrl} />
            </IonThumbnail>
            <IonLabel>
              <h2>{event.eventTitle}</h2>
              <p>{churchName}</p>
            </IonLabel>
            <IonLabel slot="end">
              <p>{eventDay}</p>
              <h2>{eventDate}</h2>
              <p>{eventTime}</p>
            </IonLabel>
            {userId === currentUserId && (
              <IonIcon
                aria-hidden="true"
                color="primary"
                icon={createOutline}
                slot="end"
              />
            )}
          </IonItem>
        )
      });
    }
    // You might want to return something else if there are no events
    return null;
  }

  return (
      <IonList>
      <IonItem
        routerLink={`/church/${churchId}`}
        button
        detail={userId !== currentUserId}
      >
        <IonThumbnail slot="start">
          <img alt="Church photo" src={imageUrl} />
        </IonThumbnail>
        <IonLabel>
          <h2>{churchName}</h2>
          {city && state && (
            <p>
              {city}, {state}
            </p>
          )}
        </IonLabel>
        {userId === currentUserId && (
          <IonIcon
            aria-hidden="true"
            color="primary"
            icon={createOutline}
          />
        )}
        <br />
      </IonItem>
      {FavEventList()}
      </IonList>
  );
};

export default FavItem;