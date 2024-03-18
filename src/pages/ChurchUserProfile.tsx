import React, { useContext, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

import LoadingSpinner from "../components/Global/LoadingSpinner";
import ErrorAlert from "../components/Global/ErrorAlert";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonPage,
  IonRouterLink,
  IonRow,
  useIonViewWillEnter,
} from "@ionic/react";
import ChurchList from "../components/Churches/ChurchList";
import ChurchUserInfo from "../components/ChurchUsers/ChurchUserInfo";
import EventsList from "../components/Events/EventsLists";
import { useFetchChurchUser } from "../hooks/useFetchChurchUser";
import { ChurchUserContext } from "../context/churchUserContext";
import { EventContext } from "../context/eventContext";
import styles from "../theme/forms.module.css";

interface ChurchUserRouteParams {
  userId: string;
}

const UserProfile: React.FC = () => {
  const params = useParams<ChurchUserRouteParams>();
  let history = useHistory();

  const { churchUser, loadingStatus, error } = useFetchChurchUser(
    parseInt(params.userId)
  );
  const { userEvents } = useContext(EventContext);

  const { checkCurrentUser, verifyCurrentUser, logoutChurchUser } = useContext(ChurchUserContext);


  useIonViewWillEnter(() => {
    async function checkingUserId() {
      let isChecked = await verifyCurrentUser();
      console.log(isChecked)
      if (isChecked === null) {
        history.push("/users")
      }
    }
    checkingUserId();
  });

    // useEffect(() => {
    //   async function checkingUserId() {
    //     let userId = params.userId.toString();
    //     let isChecked = await checkCurrentUser(userId);
    //     console.log(isChecked)
    //     if (isChecked === false) {
    //       setCurrentUserId(0)
    //       history.push("/users");
    //     }
    //   }
    //   checkingUserId();
    // },[])

  async function handleLogout() {
    localStorage.removeItem("myChurchUserToken");
    verifyCurrentUser();
    history.push(`/churches`);
  }

  return (
    <IonPage>
      <ErrorAlert error={error} />
      <LoadingSpinner status={loadingStatus} />
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <div className={styles.header}>
                <IonImg
                  src="/svg/church_hive_icon.svg"
                  className={styles.logo}
                />
                <h1 className={styles.welcome}>
                  welcome
                  <span className={styles.welcomeSpan}>
                    {churchUser?.firstName}
                  </span>
                </h1>
                <a target="_blank" href="https://churchhive.app">ChurchHive.app</a>
              </div>
            </IonCol>
            {churchUser && <ChurchUserInfo data={churchUser} />}
            <IonCol size="12">
              <div className={styles.addButton}>
                <h4>My Churches</h4>
                <IonRouterLink routerLink="/add-church" slot="end">
                  ADD
                </IonRouterLink>
              </div>
              {churchUser && churchUser?.Churches.length > 0 && (
                <ChurchList churches={churchUser.Churches} />
              )}
            </IonCol>
            <IonCol size="12">
              <div className={styles.addButton}>
                <h4>My Events</h4>
                <IonRouterLink routerLink="/add-event" slot="end">
                  ADD
                </IonRouterLink>
              </div>
              {userEvents.length > 0 && <EventsList events={userEvents} />}
            </IonCol>
          </IonRow>
          <IonCol>
            <IonButton
              expand="full"
              onClick={handleLogout}
              className={styles.button}
            >
              Logout
            </IonButton>
          </IonCol>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
