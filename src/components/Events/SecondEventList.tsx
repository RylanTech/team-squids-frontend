import React, { useState } from "react";
import EventItem from "./EventItem";
import { AllEvents } from "../../context/eventContext";
import { IonCol, IonImg, IonList } from "@ionic/react";
import SecondEventItem from "./SecondEventItem";
import EventInfo from "./EventInfo";
import styles from "../../theme/forms.module.css";

interface EventListProps {
  events: AllEvents[];
}

const SecondEventsList: React.FC<EventListProps> = ({ events }) => {
  const [event, setEvent] = useState()

  function setEvnt(evnt: any) {
    setEvent(evnt);
  }

  return (
    <>
      <IonCol size="12" sizeMd="6">
        <IonList>
          {events.map((event) => (

            <SecondEventItem setEvent={(event: any) => setEvnt(event)} event={event} key={event.eventId} />

          ))}
        </IonList>
      </IonCol>
      <IonCol size="12" sizeMd="6" id="subject-container">
        {event ? (
          <IonCol className="subject-container">
            <EventInfo data={event} />
          </IonCol>
        ) : (
          <>
            <IonCol size="12">
              <center>
                <IonImg style={{ width: "50%" }} src="/svg/church_hive_icon.svg" />
                <p className={styles.loginTitle}>
                  Select an Event
                </p>
              </center>
            </IonCol>
          </>
        )}
      </IonCol>
    </>
  );
};

export default SecondEventsList;
