import { FC } from "react";
import { IonList } from "@ionic/react";
import { AllChurches } from "../../context/churchContext";

interface NewsFeedListProps {
  articles: any
}

const NewsFeedList: FC<NewsFeedListProps> = ( { articles } ) => {

  return (
    <IonList>
      {articles.map((article: any) => (
        
        <>
        test
        </>
      
      ))}
    </IonList>
  );
};

export default NewsFeedList;