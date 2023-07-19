import React, { FormEventHandler, useContext, useEffect, useState } from "react";
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
import ChurchList from "../components/Churches/ChurchList";
import { ChurchContext } from "../context/churchContext";
import { trashBin } from "ionicons/icons";
import FavList from "../components/Favorites/FavList";

const Favorites: React.FC = () => {
  const { searchChurches, getFavChurches, churches, getAllChurches } = useContext(ChurchContext);

  const handleSearch = async (searchQuery: string) => {
    // Call function to search locations base on query
    await searchChurches(searchQuery)
  };

  const handleClear = async () => {
    await getAllChurches();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Favorites</IonTitle>
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
            <IonCol size="12">
              <FavList churches={churches} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Favorites;