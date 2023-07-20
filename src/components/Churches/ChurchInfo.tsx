import React, { useContext, useEffect, useState } from "react";
import { IonCol, IonImg, IonRow, IonText } from "@ionic/react";
import { OneChurch } from "../../context/churchContext";
import styles from "../../theme/info.module.css";
import { ChurchUserContext } from "../../context/churchUserContext";


interface ChurchInfoProps {
  data: OneChurch;
}

const ChurchInfo: React.FC<ChurchInfoProps> = ({
  data: {
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
  const { apiKey } = useContext(ChurchUserContext)
  const [favoriteChurches, setFavoriteChurches] = useState<any>()

  const staticMap = `https://maps.googleapis.com/maps/api/staticmap?center=${street},${city},${state}
  &markers=anchor:center%7Cicon:${encodeURIComponent(
    `https://i.postimg.cc/jdQN86ss/church-hive-icon-32.png`
  )}|${encodeURIComponent(`${street},${city},${state}`)}
    &zoom=13&size=400x300&key=${apiKey}`;

  useEffect(() => {
    let favChurches: string | null = localStorage.getItem("favoriteChurches")
    if (favChurches !== null) {
      let churches = JSON.parse(favChurches)
      setFavoriteChurches(churches)
    }
  }, []);

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
    </IonRow>
  );
};

export default ChurchInfo;
