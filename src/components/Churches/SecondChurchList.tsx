import { FC, useContext, useState } from "react";
import { IonButton, IonCol, IonImg, IonList } from "@ionic/react";
import { AllChurches, ChurchContext, OneChurch } from "../../context/churchContext";
import SecondChurchItem from "./SecondChurchItem";
import ChurchInfo from "./ChurchInfo";
import styles from "../../theme/forms.module.css";
import EventsList from "../Events/EventsLists";

interface ChurchListProps {
    churches: AllChurches[];
}

const SecondChurchList: FC<ChurchListProps> = ({ churches }) => {
    const [church, setChurch] = useState()
    const [churchWithEvents, setChruchWithEvents] = useState<OneChurch>()

    const { getChurch } = useContext(ChurchContext)

    async function SetChurch(church: any) {
        setChurch(church)
        let chrWithEvents = await getChurch(church.churchId)
        setChruchWithEvents(chrWithEvents)
    }

    return (
        <>
            <IonCol size="12" sizeMd="6">
                <IonList>
                    {churches.map((church) => (

                        <SecondChurchItem setChurch={(church: any) => SetChurch(church)} church={church} key={church.churchId} />

                    ))}
                </IonList>
            </IonCol>
            <IonCol size="12" sizeMd="6" id="subject-container">
                {church ? (
                    <IonCol className="subject-container">
                        <ChurchInfo data={church} />
                    </IonCol>
                ) : (
                    <>
                        <IonCol size="12">
                            <center>
                                <IonImg style={{ width: "50%" }} src="/svg/church_hive_icon.svg" />
                                <p className={styles.loginTitle}>
                                    Select a church
                                </p>
                            </center>
                        </IonCol>
                    </>
                )}
                {churchWithEvents && churchWithEvents.Events.length > 0 && (
                    <IonCol size="12">
                        <h4>Upcoming Events</h4>
                        <EventsList events={churchWithEvents.Events} />
                    </IonCol>
                )}
                {churchWithEvents && churchWithEvents.churchEmail && (
                    <IonCol size="12">
                        <IonButton
                            expand="block"
                            onClick={() => {
                                const emailLink = `mailto:${churchWithEvents.churchEmail}`;
                                window.location.href = emailLink;
                            }}
                        >
                            Connect with Us
                        </IonButton>
                    </IonCol>
                )}
            </IonCol>
        </>
    );
};

export default SecondChurchList;