import { IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Error, Refresher, SpinnerPage } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";

const Content = ({ Render, updateData, errorText }) => {
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

  if (content !== null) {
    return <Render content={content} error={error} handleUpdate={handleUpdate} />;
  }

  if (error === null) {
    return <SpinnerPage />;
  }

  return (
    <IonPage>
      <Refresher handleUpdate={handleUpdate} />
      <Error title={errorText} subtitle={error + ""} reload />
    </IonPage>
  );
};

export default Content;
