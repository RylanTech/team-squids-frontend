import { FC } from "react";
import { IonList } from "@ionic/react";
import { OneArticle } from "../../context/churchUserContext";
import NewsFeedItem from "./NewsFeedItem";

interface NewsFeedListProps {
  articles: any
}

const NewsFeedList: FC<NewsFeedListProps> = ( { articles } ) => {

  return (
    <IonList>
      {articles.map((article: OneArticle) => (
        <NewsFeedItem article={article}/>
      ))}
    </IonList>
  );
};

export default NewsFeedList;