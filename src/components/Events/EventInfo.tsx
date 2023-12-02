import React, { useContext, useEffect, useState } from "react";
import { IonButton, IonCol, IonImg, IonRow, IonText } from "@ionic/react";
import { EventContext, OneEvent } from "../../context/eventContext";
import styles from "../../theme/info.module.css";
import { ChurchUserContext } from "../../context/churchUserContext";
import { useHistory } from "react-router";
import { useFetchEvent } from "../../hooks/useFetchEvent";

interface EventInfoProps {
  data: OneEvent;
}

const EventInfo: React.FC<EventInfoProps> = ({
  data: {
    eventId,
    eventTitle,
    location: { street, city, state, zip },
    date,
    eventType,
    description,
    imageUrl,
    Church,
  },
}) => {
  const { event, loadingStatus, error } = useFetchEvent(
    eventId
  );

  const { deleteEvent } = useContext(EventContext);
  const { currentUserId } = useContext(ChurchUserContext);
  const history = useHistory()

  function convertUtcToLocal(utcDateString: any) {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return localDate;
  };

  const thisIsoDate = new Date(convertUtcToLocal(date))
  const isoDate = new Date(thisIsoDate);
  const formatDate = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
  });
  const formatDay = Intl.DateTimeFormat("en-us", {
    weekday: "long",
  });
  const formatTime = Intl.DateTimeFormat("en-us", {
    timeStyle: "short",
  });

  const eventDate = isoDate ? formatDate.format(isoDate) : "";
  const eventDay = isoDate ? formatDay.format(isoDate) : "";
  const eventTime = isoDate ? formatTime.format(isoDate) : "";

  const { apiKey } = useContext(ChurchUserContext)

  const staticMap = `https://maps.googleapis.com/maps/api/staticmap?center=${street},${city},${state}
  &markers=anchor:center%7Cicon:${encodeURIComponent(
    `https://i.postimg.cc/jdQN86ss/church-hive-icon-32.png`
  )}|${encodeURIComponent(`${street},${city},${state}`)}
    &zoom=13&size=400x300&key=${apiKey}`;

  async function handleDeleteEvent(eventId: number) {
    try {
      await deleteEvent(eventId);
      history.push("/");
    } catch (error) {
      console.error(error);
    };
  };

  function ifImg() {
    if (imageUrl === "blank") {
      console.log(event)
      return (
        <></>
      )
    } else {
      return (
        <IonImg className={styles.heroImg} src={imageUrl} alt={eventTitle} />
      )
    }
  }



  return (
    <IonRow className={styles.light}>
      <IonCol size="12">
        {ifImg()}
      </IonCol>
      <IonCol size="12">
        <IonText color="secondary">
          <h6>{eventType}</h6>
        </IonText>
        <h1 className={styles.title}>{eventTitle}</h1>
        <IonText color="secondary">
          <h6>{Church.churchName}</h6>
        </IonText>
      </IonCol>
      <IonCol size="12">
        <h4>Date and Time</h4>

        <p>
          {eventDay}, {eventDate} at {eventTime}
        </p>
      </IonCol>
      <IonCol size="12">
        <h4>Location</h4>

        <p>
          {street} <br />
          {city}, {state} {zip}
        </p>
      </IonCol>
      <IonCol>
        <IonImg src={staticMap} alt="staticMap">
          {" "}
        </IonImg>
      </IonCol>
      <IonCol size="12">
        <h4>Description</h4>

        <p>{description}</p>
      </IonCol>
      <IonCol size="12" >
        <IonRow>
          {event && event.Church && (
            <IonCol size="12">
              <h4>Contact Information</h4>
              <a href={`https://${event.Church.website}`} className={styles.link}>
                <p>{event.Church.churchEmail}</p>
              </a>

              <p>{event.Church.phoneNumber}</p>
            </IonCol>
          )}
          {event && event.Church.churchEmail && (
            <IonCol size="12">
              <IonButton
                expand="block"
                onClick={() => {
                  const emailLink = `mailto:${event.Church.churchEmail}`;
                  window.location.href = emailLink;
                }}
              >
                Connect with Us
              </IonButton>
            </IonCol>
          )}
          {event && event.Church.userId === currentUserId && (
            <IonCol size="12">
              <IonButton
                id="editEvent"
                color="secondary"
                fill="outline"
                expand="block"
                routerLink={`/edit-event/${event.eventId}`}
              >
                Edit Event
              </IonButton>
            </IonCol>
          )}
          {event && event.Church.userId === currentUserId && (
            <IonCol size="12">
              <IonButton
                id="deleteEvent"
                color="danger"
                fill="outline"
                expand="block"
                onClick={() => handleDeleteEvent(event.eventId)}
              >
                Delete Event
              </IonButton>
            </IonCol>
          )}
        </IonRow>
      </IonCol>
    </IonRow>
  );
};

export default EventInfo;
