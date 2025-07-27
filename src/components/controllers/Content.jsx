import { IonContent, IonPage } from "@ionic/react";
import isEqual from "fast-deep-equal";
import { Store } from "pullstate";
import { createContext, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { Error, Refresher, SkeletonPage } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { useTranslation } from "react-i18next";

const Content = memo(({ Render, fetchContent, errorText }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const { errorModal, confirmModal } = useModal();
  const params = useParams();
  const location = useLocation();

  const formRef = useRef(null);
  const firstRender = useRef(true);

  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  errorText ||= t("api.dataLoadError");

  const handleUpdate = useCallback(async () => {
    if (formRef.current?.isDirty()) {
      const surety = await confirmModal(t("basic.confirmDiscardChanges"));

      if (!surety) {
        return;
      }
    }

    if (firstRender.current && location.state !== undefined) {
      firstRender.current = false;
      setContent(location.state);
      return;
    }

    fetchContent(params)
      .then((data) => setContent(data))
      .catch((error) => {
        if (content === null) setError(error);
        else errorModal(errorText, error);
      });
  }, [paramsKey, fetchContent, errorModal, confirmModal, errorText]);

  useEffect(() => {
    handleUpdate();
  }, [paramsKey]);

  if (content !== null) {
    return (
      <StatefulFormContext.Provider value={formRef}>
        <Render content={content} onUpdate={handleUpdate} />
      </StatefulFormContext.Provider>
    );
  }

  if (error === null) {
    return <SkeletonPage />;
  }

  return (
    <IonPage>
      <IonContent>
        <Refresher onUpdate={handleUpdate} />
        <Error title={errorText} subtitle={error + ""}>
          {t("basic.pullToRefresh")}
        </Error>
      </IonContent>
    </IonPage>
  );
});

export default Content;

const StatefulFormContext = createContext(null);

export const useStatefulForm = () => {
  return useContext(StatefulFormContext);
};

export const StatefulForm = ({ children, Render, content, onSubmit, props }) => {
  const { t } = useTranslation();
  const current = useRef(new Store(content));
  const initial = useRef(null);

  const router = useHistory();
  const { confirmModal } = useModal();
  const formRef = useStatefulForm();

  const discardChanges = () => {
    current.current.replace(initial.current);
  };

  const acceptChanges = () => {
    initial.current = current.current.getRawState();
  };

  const handleSubmit = () => {
    onSubmit(current.current.getRawState());
    acceptChanges();
  };

  const isDirty = () => !isEqual(initial.current, current.current.getRawState());

  useEffect(() => {
    // after first render
    if (initial.current !== null) {
      current.current.replace(content);
    }

    acceptChanges();
  }, [content]);

  useEffect(() => {
    const removeListener = router.block((location) => {
      if (!isDirty()) {
        return true;
      }

      // cache action as it can change after user response
      const action = router.action;

      confirmModal(t("basic.confirmDiscardChanges")).then((value) => {
        if (!value) {
          return;
        }

        discardChanges();

        // resume routing
        if (action === "REPLACE") {
          router.replace(location);
        } else {
          router.push(location);
        }
      });

      // always block route as the routing is now handled manually
      return false;
    });
    return removeListener;
  }, []);

  useImperativeHandle(formRef, () => ({
    submit: handleSubmit,
    isDirty,
    discardChanges,
    acceptChanges,
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
