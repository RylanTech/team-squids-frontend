import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useFetchChurch } from "../hooks/useFetchChurch";
import LoadingSpinner from "../components/Global/LoadingSpinner";
import ChurchInfo from "../components/Churches/ChurchInfo";
import ErrorAlert from "../components/Global/ErrorAlert";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
} from "@ionic/react";
import { ChurchContext } from "../context/churchContext";
import { ChurchUserContext } from "../context/churchUserContext";
import PageHeader from "../components/Global/PageHeader";
import { AllEvents, EventContext } from "../context/eventContext";
import EventsList from "../components/Events/EventsLists";

interface ChurchRouteParams {
  churchId: string;
}

const ChurchProfile: React.FC = () => {
  const params = useParams<ChurchRouteParams>();
  const history = useHistory();
  const { deleteChurch } = useContext(ChurchContext);
  const { deleteEvent } = useContext(EventContext);
  const { currentUserId } = useContext(ChurchUserContext);
  const [churches, setChurches] = useState<Array<number>>([]);
  const [isFavoriteChurch, setIsFavoriteChurch] = useState(false)
  const { church, loadingStatus, error } = useFetchChurch(
    parseInt(params.churchId)
  );

  useEffect(() => {
    let favChurches: string | null = localStorage.getItem("favoriteChurches");
    if (favChurches !== null) {
      const parsedChurches: Array<number> = JSON.parse(favChurches);
      setChurches(parsedChurches);
      if (parsedChurches.includes(parseInt(params.churchId))) {
        setIsFavoriteChurch(true);
      } else {
        setIsFavoriteChurch(false)
      }
    } else {
      setIsFavoriteChurch(false)
    }
  }, []);

  async function handleDeleteChurchAndEvents(
    events: AllEvents[],
    churchId: number
  ) {
    try {
      if (events.length !== 0) {
        await Promise.all(events.map((event) => deleteEvent(event.eventId)));
      }
      await deleteChurch(churchId);
      history.push(`/user/${currentUserId}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function addFavorite() {
    setIsFavoriteChurch(true);
    const updatedChurches = [...churches, parseInt(params.churchId)];
    setChurches(updatedChurches)
    let i = JSON.stringify(updatedChurches)
    console.log(i)
    localStorage.setItem("favoriteChurches", i)
  }
  
  async function removeFavorite() {
    setIsFavoriteChurch(false);
    const updatedChurches = churches.filter(
      (churchId) => churchId !== parseInt(params.churchId)
    );
    setChurches(updatedChurches)
    let i = JSON.stringify(updatedChurches)
    console.log(i)
    localStorage.setItem("favoriteChurches", i)
  }

  return (
    <IonPage>
      <ErrorAlert error={error} />
      {/* {loadingStatus && <LoadingSpinner status={true} />} */}
      <PageHeader header={church ? church?.churchName : "No Church"} />
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {church && <ChurchInfo data={church} />}
            {church && church.Events.length > 0 && (
              <IonCol size="12">
                <h4>Upcoming Events</h4>
                <EventsList events={church.Events} />
              </IonCol>
            )}
          </IonRow>
          <IonRow>
            {church && church.churchEmail && (
              <IonCol size="12">
                <IonButton
                  expand="block"
                  onClick={() => {
                    const emailLink = `mailto:${church.churchEmail}`;
                    window.location.href = emailLink;
                  }}
                >
                  Connect with Us
                </IonButton>
              </IonCol>
            )}
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
            {church && church.userId === currentUserId && (
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
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ChurchProfile;
