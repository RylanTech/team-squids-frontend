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
  interface ChurchRouteParams {
    churchId: string;
  }

  const { searchChurches, getFavChurches, churches, favoriteChurches, getAllChurches } = useContext(ChurchContext);
  const [favorites, setFavorites] = useState()
  const params = useParams<ChurchRouteParams>();

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
              <FavList churches={favoriteChurches} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Favorites;