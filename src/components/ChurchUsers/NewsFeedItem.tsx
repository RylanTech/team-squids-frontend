import { IonIcon, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { useContext } from "react";
import { Articles, ChurchUserContext, OneArticle } from "../../context/churchUserContext";

interface ContainerProps {
  article: OneArticle;
}

const NewsFeedItem: React.FC<ContainerProps> = ({
  article: {
    createdAt,
    updatedAt,
    title,
    body,
    ArticleId
  },
}) => {

  const thisIsoDate = new Date(createdAt)
  const isoDate = new Date(thisIsoDate);
  const formatDate = Intl.DateTimeFormat("en-us", {
    dateStyle: "long",
  });
  const formatDay = Intl.DateTimeFormat("en-us", {
    weekday: "long",
  });
  const formatTime = Intl.DateTimeFormat("en-us", {
    timeStyle: "short",
  });
  const eventDate = formatDate.format(isoDate);
  const eventDay = formatDay.format(isoDate);
  const eventTime = formatTime.format(isoDate);

  return (
    <IonItem
      routerLink={`/article/${ArticleId}`}
      button
    >
      <IonLabel>
        <h2>{title}</h2>
      </IonLabel>
      <IonLabel slot="end">
        <p>{eventDay}</p>
        <h2>{eventDate}</h2>
        <p>{eventTime}</p>
      </IonLabel>
    </IonItem>
  );
};

export default NewsFeedItem;