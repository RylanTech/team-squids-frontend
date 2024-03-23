import { FC, useContext, useEffect, useState } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonImg, IonItem, IonList, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { ChurchUserContext, OneArticle } from "../context/churchUserContext";
import { useParams } from "react-router";
import styles from "../theme/forms.module.css";


const Article: FC = () => {
  const [article, setArticle] = useState<any>()

  interface ArticleRouteParams {
    articleId: string;
  }

  const { getArticle } = useContext(ChurchUserContext)
  const params = useParams<ArticleRouteParams>();

  useEffect(() => {
    async function gettingArticle() {
      let art = await getArticle(parseInt(params.articleId))
      setArticle(art)
    }
    gettingArticle()
  }, [])

  function getDateString(articleTime: Date) {
    const isoDate = new Date(articleTime);
    const formatDate = Intl.DateTimeFormat("en-us", {
      dateStyle: "long",
    });
    const formatDay = Intl.DateTimeFormat("en-us", {
      weekday: "long",
    });
    const formatTime = Intl.DateTimeFormat("en-us", {
      timeStyle: "short",
    });

    const eventDate = isoDate ? formatDate.format(isoDate) : "";
    const eventDay = isoDate ? formatDay.format(isoDate) : "";
    const eventTime = isoDate ? formatTime.format(isoDate) : "";
    return (
      <>
        {eventDay}, {eventDate} at {eventTime}
      </>
    )
  }

  function ifUpdated(articleTime: Date) {
    if (article.updatedAt === article.createdAt) {
      return
    } else {
      return (
        <>
          Updated on: {getDateString(articleTime)}
        </>
      )
    }
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            {article ? (
              <>
                {article.title}
              </>
            ) : (
              <>
                Loading...
              </>
            )}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <center>
                <IonImg style={{ width: "50%" }} src="/svg/church_hive_icon.svg" />
                <br />
              </center>
            </IonCol>
          </IonRow>
          <IonRow>
            {article ? (
              <>
                <IonCol>
                  <center>
                    <h2>
                      {article.title}
                    </h2>
                  </center>
                  <br />
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {article.body}
                  </div>
                  <br /><br /><br /><br />
                  <center>
                    {ifUpdated(article.updatedAt)}
                    <br />
                    Written on: {getDateString(article.createdAt)}
                  </center>
                </IonCol>
              </>
            ) : (
              <>
              </>
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Article;