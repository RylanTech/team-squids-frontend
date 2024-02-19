import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";
import LoginAccount from "./LoginAccount";
import styles from "../theme/forms.module.css";

const UserAuth: React.FC = () => {

  return (
    <IonPage>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <div className={styles.header}>
                <IonImg src="/svg/church_hive_icon.svg" className={styles.logo} />
                <h1 className={styles.title}>
                  Church
                  <span className={styles.titleSpan}>
                    Hive
                  </span>
                </h1>
                <a target="_blank" href="https://churchhive.app">ChurchHive.app</a>
              </div>
            </IonCol>
          </IonRow>
          <LoginAccount />
          <IonRow>
            <div className="lmLink">
              <center>
                <a target="_blank" href="https://churchhive.app/signup">Learn more</a> about getting your church on Church Hive.
              </center>
            </div>
            <div className="lmLink">
              <center>
                <a target="_blank" href="https://churchhive.app/ced">Learn more</a> about church website events intergration.
              </center>
            </div>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default UserAuth;
