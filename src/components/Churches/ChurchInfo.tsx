import React, { useContext, useEffect, useState } from "react";
import { IonButton, IonCol, IonImg, IonRow, IonText } from "@ionic/react";
import { ChurchContext, ChurchWithEvents, OneChurch } from "../../context/churchContext";
import styles from "../../theme/info.module.css";
import { ChurchUserContext } from "../../context/churchUserContext";
import { AllEvents, EventContext } from "../../context/eventContext";
import { useHistory, useParams } from "react-router";


interface ChurchInfoProps {
  data: OneChurch;
}

const ChurchInfo: React.FC<ChurchInfoProps> = ({
  data: {
    churchId,
    churchName,
    denomination,
    location: { street, city, state, zip },
    phoneNumber,
    churchEmail,
    welcomeMessage,
    serviceTime,
    imageUrl,
    website,
  },
}) => {
  const history = useHistory();
  const { deleteChurch, getChurch } = useContext(ChurchContext);
  const { deleteEvent } = useContext(EventContext);
  const { currentUserId } = useContext(ChurchUserContext);
  const [churches, setChurches] = useState<Array<number>>([]);
  const [isFavoriteChurch, setIsFavoriteChurch] = useState(false)
  const [church, setChurch] = useState<ChurchWithEvents>()

  const { apiKey } = useContext(ChurchUserContext)

  useEffect(() => {
    async function gettingChurch() {
      let chrch = await getChurch(churchId)
      setChurch(chrch)
    }
    gettingChurch()
  },[])

  async function handleDeleteChurchAndEvents(
    events: AllEvents[] | undefined,
    churchId: number
  ) {
    try {
      if (events) {
        if (events.length !== 0) {
          await Promise.all(events.map((event) => deleteEvent(event.eventId)));
        }
      }
      await deleteChurch(churchId);
      history.push(`/user/${currentUserId}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function addFavorite() {
    setIsFavoriteChurch(true);
    const updatedChurches = [...churches, parseInt(churchId.toString())];
    setChurches(updatedChurches)
    let i = JSON.stringify(updatedChurches)
    localStorage.setItem("favoriteChurches", i)
  }

  async function removeFavorite() {
    setIsFavoriteChurch(false);
    const updatedChurches = churches.filter(
      (chrchId) => chrchId !== churchId
    );
    
    console.log(updatedChurches)
    setChurches(updatedChurches)
    let i = JSON.stringify(updatedChurches)
    localStorage.setItem("favoriteChurches", i)
  }

  const staticMap = `https://maps.googleapis.com/maps/api/staticmap?center=${street},${city},${state}
  &markers=anchor:center%7Cicon:${encodeURIComponent(
    `https://i.postimg.cc/jdQN86ss/church-hive-icon-32.png`
  )}|${encodeURIComponent(`${street},${city},${state}`)}
    &zoom=13&size=400x300&key=${apiKey}`;

  useEffect(() => {
    let favChurches: string | null = localStorage.getItem("favoriteChurches")
    setIsFavoriteChurch(false)
    if (favChurches !== null) {
      let chrches = JSON.parse(favChurches)
      chrches.map((id:number) => {
        if (id === churchId) {
          setIsFavoriteChurch(true)
        }
      })
      setChurches(chrches)
    }
  }, [churchId]);

  return (
    <IonRow className={styles.light}>
      <IonCol size="12">
        <IonImg className={styles.heroImg} src={imageUrl} alt={churchName} />
      </IonCol>
      <IonCol size="12">
        <h1 className={styles.title}>{churchName}</h1>
        <IonText color="secondary">
          <h6>{denomination}</h6>
        </IonText>
      </IonCol>
      <IonCol size="12">
        <h4>Service Times</h4>
        <p>{serviceTime}</p>
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
        <h4>Contact Information</h4>
        <a href={`https://${website}`}>
          <p className={styles.link}>{website}</p>
        </a>

        <p>{phoneNumber}</p>
      </IonCol>
      <IonCol size="12">
        <h4>Welcome to {churchName}</h4>
        <p>{welcomeMessage}</p>
      </IonCol>
      {church && church.userId === currentUserId && (
        <IonCol size="12">
          <IonButton
            id="editChurch"
            color="secondary"
            fill="outline"
            expand="block"
            routerLink={`/edit-church/${church.churchId}`}
          >
            Edit Church
          </IonButton>
        </IonCol>
      )}
      {church && church.Events && church.userId === currentUserId && (
        <IonCol size="12">
          <IonButton
            id="deleteChurch"
            color="danger"
            fill="outline"
            expand="block"
            onClick={() =>
              handleDeleteChurchAndEvents(church.Events, church.churchId)
            }
          >
            {church.Events.length === 0
              ? "Delete Church"
              : "Delete Church & Events"}
          </IonButton>
        </IonCol>
      )}
      <IonCol size="12">
        <IonButton
          id="setFav"
          color="secondary"
          fill="outline"
          expand="block"
          onClick={() =>
            isFavoriteChurch ? removeFavorite() : addFavorite()
          }
        >
          {isFavoriteChurch ? "Remove Favorite" : "Add Favorite"}
        </IonButton>
      </IonCol>
    </IonRow>
  );
};

export default ChurchInfo;