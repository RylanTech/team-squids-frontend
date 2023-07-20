import React, { useContext, useState } from "react";
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
  useIonViewWillEnter,
} from "@ionic/react";
import { ChurchContext } from "../context/churchContext";
import { trashBin } from "ionicons/icons";
import FavList from "../components/Favorites/FavList";
import { useParams } from "react-router";

const Favorites: React.FC = () => {

  const { searchChurches, getFavChurches, favoriteChurches } = useContext(ChurchContext);

  useIonViewWillEnter(() => {
    getFavChurches();
  });

  const handleSearch = async (searchQuery: string) => {
    // Call function to search locations base on query
    await searchChurches(searchQuery)
  };

  const handleClear = async () => {
    await getFavChurches();
  }

  function isFav() {
    let i = localStorage.getItem("favoriteChurches")
    if (i !== "[]") {
      return <FavList churches={favoriteChurches} />
    } else {
      return (
        <center>
          <h2>No Favorite Churches</h2>
        </center>
      )
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
        {/* <IonToolbar color="primary">
          <IonSearchbar 
          onIonChange={(e) => handleSearch(e.detail.value!)}
          onIonClear={handleClear}
          clearIcon={trashBin} 
          ></IonSearchbar>
        </IonToolbar> */}
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