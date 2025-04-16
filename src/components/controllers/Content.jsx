import { IonContent, IonModal, IonPage } from "@ionic/react";
import isEqual from "fast-deep-equal";
import { Store } from "pullstate";
import { createContext, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { Error, Refresher, SpinnerPage } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";

const Content = ({ Render, fetchContent, errorText }) => {
  const params = useParams();
  const formRef = useRef(null);

  const { errorModal, confirmModal, actionFeedbackModal } = useModal();

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    if (formRef.current?.isDirty()) {
      const surety = await confirmModal("Zmeny neboli uložené, naozaj chceš aktualizovať stránku?");

      if (!surety) {
        return;
      }
    }

    fetchContent(params)
      .then((data) => setContent(data))
      .catch((error) => (content === null ? setError(error) : errorModal(errorText, error)));
  };

  useEffect(() => {
    handleUpdate();
  }, [params]);

  if (content !== null) {
    return (
      <StatefulFormContext.Provider value={formRef}>
        <Render formRef={formRef} content={content} error={error} onUpdate={handleUpdate} />;
      </StatefulFormContext.Provider>
    );
  }

  if (error === null) {
    return <SpinnerPage />;
  }

  return (
    <IonPage>
      <IonContent>
        <Refresher onUpdate={handleUpdate} />
        <Error title={errorText} subtitle={error + ""}>
          Ak chceš skúsiť znova, potiahni zhora nadol.
        </Error>
      </IonContent>
    </IonPage>
  );
};

export default Content;

export const Modal = ({ Render, content, onClose, onUpdate, props }) => {
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location]);

  return (
    <IonModal isOpen={content !== null} onDidDismiss={onClose}>
      {content !== null && <Render content={content} onUpdate={onUpdate} onClose={onClose} props={props} />}
    </IonModal>
  );
};

const StatefulFormContext = createContext(null);

export const useStatefulForm = () => {
  return useContext(StatefulFormContext);
};

export const StatefulForm = ({ children, Render, content, onSubmit, props }) => {
  const current = useRef(new Store(content));
  const initial = useRef(null);

  const history = useHistory();
  const { confirmModal } = useModal();
  const formRef = useStatefulForm();

  const markAsNotDirty = () => {
    initial.current = current.current.getRawState();
  };

  const handleSubmit = () => {
    markAsNotDirty();
    onSubmit(current.current.getRawState());
  };

  const isDirty = () => !isEqual(initial.current, current.current.getRawState());

  useEffect(() => {
    // after first render
    if (initial.current !== null) {
      current.current.replace(content);
    }

    markAsNotDirty();
  }, [content]);

  useEffect(() => {
    const removeListener = history.block(() => {
      if (!isDirty()) {
        return true;
      }

      // save before this page is destroyed
      const state = current.current.getRawState();

      confirmModal("Zmeny neboli uložené. Chceš ich uložiť?").then((value) => {
        // no need to update initial state
        if (value) {
          onSubmit(state);
        }
      });

      // since modal is async, there is no way to wait for response in sync function
      return true;
    });

    return removeListener;
  }, []);

  useImperativeHandle(formRef, () => ({
    submit: handleSubmit,
    isDirty,
    markAsNotDirty,
  }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <Render store={current.current} props={props} />
      {children}
    </form>
  );
};

export const StatelessForm = ({ children, onSubmit, ...props }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event.target.elements);
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
};
