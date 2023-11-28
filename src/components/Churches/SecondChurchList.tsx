import { FC, useState } from "react";
import { IonCol, IonList } from "@ionic/react";
import { AllChurches } from "../../context/churchContext";
import ChurchItem from "./ChurchItem";
import SecondChurchItem from "./SecondChurchItem";
import ChurchInfo from "./ChurchInfo";

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
        <IonCol size="12" sizeMd="6">
            {church ? (
                <ChurchInfo data={church}/>
            ) : (
                <>
                test
                </>
            )}
        </IonCol>
        </>
    );
};

export default SecondChurchList;