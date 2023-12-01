import { FC, useState } from "react";
import { IonCol, IonImg, IonList } from "@ionic/react";
import { AllChurches } from "../../context/churchContext";
import SecondChurchItem from "./SecondChurchItem";
import ChurchInfo from "./ChurchInfo";
import styles from "../../theme/forms.module.css";

interface ChurchListProps {
    churches: AllChurches[];
}

const SecondChurchList: FC<ChurchListProps> = ({ churches }) => {
    const [church, setChurch] = useState()

    function SetChurch(church: any) {
        setChurch(church)
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
            </IonCol>
        </>
    );
};

export default SecondChurchList;