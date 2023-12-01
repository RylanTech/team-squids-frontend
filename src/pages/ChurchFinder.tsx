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
import { ChurchUserContext } from "../context/churchUserContext";
import SecondChurchList from "../components/Churches/SecondChurchList";

const ChurchFinder: React.FC = () => {
  const { searchChurches, churches, getAllChurches } = useContext(ChurchContext);
  const { getApiKey } = useContext(ChurchUserContext)

  const [width, setWidth] = useState<number>()

  useEffect(() => {
    function getKey() {
      getApiKey()
    }
    setWidth(window.innerWidth)
    getKey()
  }, [])

  useEffect(() => {
    // Function to update the screenWidth state
    const updateScreenWidth = () => {
      setWidth(window.innerWidth);
    };

    // Attach the event listener to window resize
    window.addEventListener('resize', updateScreenWidth);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  const handleSearch = async (searchQuery: string) => {
    // Call function to search locations base on query
    await searchChurches(searchQuery)
  };

  const handleClear = async () => {
    await getAllChurches();
  }

  function churchFront() {
    if (width) {
      if (width > 768) {
        return (
          <>
          <SecondChurchList churches={churches} />
          </>
        )
      } else {
        return (
          <IonCol size="12" sizeMd="6">
            <ChurchList churches={churches} />
          </IonCol>
        )
      }
    } else {
      return (
        <>Error</>
      )
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Church Finder</IonTitle>
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
            {churchFront()}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ChurchFinder;