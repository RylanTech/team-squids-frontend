import { IonIcon, IonItem, IonLabel, IonThumbnail } from "@ionic/react";

import { AllEvents } from "../../context/eventContext";
import { useContext } from "react";
import { createOutline } from "ionicons/icons";
import { ChurchUserContext } from "../../context/churchUserContext";

interface ContainerProps {
  event: AllEvents;
  setEvent: any;
}

const SecondEventItem: React.FC<ContainerProps> = ({
  event: {
    eventId,
    eventTitle,
    location: { street, city, state, zip },
    date,
    eventType,
    description,
    imageUrl,
    Church: { userId, churchName }
  },
  setEvent,
}) => {
  const { currentUserId } = useContext(ChurchUserContext);
  function convertUtcToLocal(utcDateString: any) {
    const utcDate = new Date(utcDateString);
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
    return localDate;
  }

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
  const eventDate = formatDate.format(isoDate);
  const eventDay = formatDay.format(isoDate);
  const eventTime = formatTime.format(isoDate);

  function handleSetEvent() {
    const event: any = {
      eventId,
      eventTitle,
      location: { street, city, state, zip },
      date,
      eventType,
      description,
      imageUrl,
      Church: { userId, churchName }
    }
    setEvent(event)
  }

  function ifImg() {
    if (imageUrl === "blank") {
      return (
        <></>
      )
    } else {
      return (
        <IonThumbnail slot="start">
          <img alt={"Error loading Image"} src={imageUrl} />
        </IonThumbnail>
      )
    }
  };

  return (
    <IonItem
      onClick={() => handleSetEvent()}
      button
      detail={userId !== currentUserId}
    >
      {ifImg()}
      <IonLabel>
        <h2>{eventTitle}</h2>
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
  );
};

export default SecondEventItem;