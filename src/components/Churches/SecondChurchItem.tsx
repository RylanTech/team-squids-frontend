import React, { useContext, useEffect } from "react";
import { IonIcon, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import { Church } from "../../context/churchContext";
import { ChurchUserContext } from "../../context/churchUserContext";

interface ContainerProps {
    church: Church;
    setChurch: any;
}

const SecondChurchItem: React.FC<ContainerProps> = ({
    church: {
        churchId,
        userId,
        churchName,
        denomination,
        location: { street, city, state, zip },
        phoneNumber,
        churchEmail,
        welcomeMessage,
        serviceTime,
        imageUrl,
        website,
    },
    setChurch
}) => {
    const { currentUserId } = useContext(ChurchUserContext);

    const church: any = {
        churchId,
        userId,
        churchName,
        denomination,
        location: { street, city, state, zip },
        phoneNumber,
        churchEmail,
        welcomeMessage,
        serviceTime,
        imageUrl,
        website,
    }

    return (
        <IonItem
            onClick={() => setChurch(church)}
            button
            detail={userId !== currentUserId}
        >
            <IonThumbnail slot="start">
                <img alt="Church photo" src={imageUrl} />
            </IonThumbnail>
            <IonLabel>
                <h2>{churchName}</h2>
                {city && state && (
                    <p>
                        {city}, {state}
                    </p>
                )}
            </IonLabel>
            {userId === currentUserId && (
                <IonIcon
                    aria-hidden="true"
                    color="primary"
                    icon={createOutline}
                />
            )}
        </IonItem>
    );
};

export default SecondChurchItem;
