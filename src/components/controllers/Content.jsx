import { IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent } from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FatalError, Spinner } from "@/components/ui/Design";
import { useModal } from "@/utils/modals";

const Content = ({ Render, Header, updateData, errorText }) => {
  const params = useParams();
  const { errorModal } = useModal();

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = () =>
    updateData(params)
      .then((data) => setContent(data))
      .catch((error) => (content === null ? setError(error) : errorModal(errorText, error)));

  useEffect(() => {
    handleUpdate();
  }, [params]);

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(event) => handleUpdate().finally(event.detail.complete)}>
          <IonRefresherContent />
        </IonRefresher>
        {content === null ? <ContentNotPresent error={error} text={errorText} /> : <Render content={content} error={error} handleUpdate={handleUpdate} />}
      </IonContent>
    </IonPage>
  );
};

const ContentNotPresent = ({ error, text }) => {
  return error === null ? <Spinner /> : <FatalError title={text} subtitle={error + ""} />;
};

export default Content;
