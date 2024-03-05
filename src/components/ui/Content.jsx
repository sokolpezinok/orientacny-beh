import { IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent } from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fatalModal } from "@/utils/modals";
import { FatalError, Spinner } from "./Media";

const Content = ({ Render, Header, updateData, errorText }) => {
  const params = useParams();

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = () =>
    updateData(params)
      .then((data) => setContent(data))
      .catch((error) => (content === null ? setError(error) : fatalModal(errorText)));

  useEffect(() => {
    handleUpdate();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(event) => handleUpdate().finally(() => event.detail.complete())}>
          <IonRefresherContent />
        </IonRefresher>
        {content === null ? <ContentNotPresent error={error} errorText={errorText} /> : <Render content={content} error={error} handleUpdate={handleUpdate} />}
      </IonContent>
    </IonPage>
  );
};

const ContentNotPresent = ({ error, errorText }) => {
  return error === null ? <Spinner /> : <FatalError error={error} text={errorText} />;
};

export default Content;
