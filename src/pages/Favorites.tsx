import React, { useContext } from "react";
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { ChurchContext } from "../context/churchContext";
import FavList from "../components/Favorites/FavList";

const Favorites: React.FC = () => {

  const { getFavChurches, favoriteChurches } = useContext(ChurchContext);

  useIonViewWillEnter(() => {
    getFavChurches();
  });

  const handleClear = async () => {
    await getFavChurches();
  }

  function isFav() {
    let i = localStorage.getItem("favoriteChurches")
    if (!i) {
      return (
        <center>
          <h2>No Favorite Churches</h2>
          <p>Favorite a church to receive notifications about their events!</p>
        </center>
      )
    } else if (i === "[]") {
      return (
        <center>
          <h2>No Favorite Churches</h2>
          <p>Favorite a church to receive notifications about their events!</p>
        </center>
      )
    } else {
      return <FavList churches={favoriteChurches} />
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              {isFav()}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Favorites;