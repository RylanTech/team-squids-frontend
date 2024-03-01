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
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { AppUserContext, appUser } from "../context/appUserContext";

const ChurchFinder: React.FC = () => {
  const { searchChurches, churches, getAllChurches } = useContext(ChurchContext);
  const { getApiKey } = useContext(ChurchUserContext)
  const { createAppUser } = useContext(AppUserContext)

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

  useEffect(() => {
    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== 'granted') {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive === 'denied') {
            console.log('Push Notification permission denied');
          }
          else {
            console.log('Push Notification permission granted');
            register();
          }
        });
      } else {
        register();
      }
    });
  }, [])

  const register = () => {
    console.log('Initializing HomePage');

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success');

        if (token) {
          let strToken = token.value
          localStorage.setItem('phoneToken', strToken)
          
          let favStr = localStorage.getItem("favoriteChurches");
          if (favStr) {
            let favArr = JSON.parse(favStr)
            let userInfo: appUser = {
              favArr: favArr,
              phoneId: strToken
            }
            createAppUser(userInfo)
          } else {
            let userInfo: appUser = {
              favArr: [],
              phoneId: token.value
            }
            createAppUser(userInfo)
          }
        } else {
          console.log("No token to submit for notifications")
        }

      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );
  }

  const handleSearch = async (searchQuery: string) => {
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