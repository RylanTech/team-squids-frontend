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
  const { church, error } = useFetchChurch(
    parseInt(params.churchId)
  );

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
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ChurchProfile;
