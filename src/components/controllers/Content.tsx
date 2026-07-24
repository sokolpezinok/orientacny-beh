import { IonContent, IonPage } from "@ionic/react";
import isEqual from "fast-deep-equal";
import { Store } from "pullstate";
import { ComponentType, createContext, FormEvent, FormHTMLAttributes, memo, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Fatal, Refresher, SkeletonPage } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { Ref } from "react";
import { useTranslation } from "react-i18next";

const Content = memo(
  <T, P extends object>({ Render, fetchContent, errorText }: { Render: ComponentType<{ content: T; onUpdate: () => void }>; fetchContent: (params: P) => Promise<T>; errorText: string }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { errorModal, confirmModal } = useModal();
    const params = useParams<P>();
    const formRef = useRef<StatefulFormHandle>(null);

    const paramsKey = useMemo(() => JSON.stringify(params), [params]);

    errorText ||= t("api.dataLoadError");

    console.log(content, error);

    const handleUpdate = useCallback(async () => {
      if (formRef.current?.isDirty()) {
        const surety = await confirmModal(t("basic.confirmDiscardChanges"));

        if (!surety) {
          return;
        }
      }

      fetchContent(params)
        .then((data) => {
          setContent(data);
          data;
        })
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
          <Fatal title={errorText} subtitle={error + ""}>
            {t("basic.pullToRefresh")}
          </Fatal>
        </IonContent>
      </IonPage>
    );
  }
);

export default Content;

export type StatefulFormHandle = {
  submit: () => void;
  isDirty: () => boolean;
  discardChanges: () => void;
  acceptChanges: () => void;
};

const StatefulFormContext = createContext<Ref<StatefulFormHandle> | null>(null);

export const useStatefulForm = () => {
  const context = useContext(StatefulFormContext);

  if (context === null) {
    throw new Error("StatefulFormContext not found.");
  }

  return context;
};

export const StatefulForm = <S extends object>({
  children,
  Render,
  content,
  onSubmit,
}: {
  children: ReactNode;
  Render: ComponentType<{ store: Store<S> }>;
  content: S;
  onSubmit: (value: S) => void;
}) => {
  const { t } = useTranslation();
  const current = useRef(new Store(content));
  const initial = useRef<S>(content);

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
    acceptChanges();
  }, [content]);

  useEffect(() => {
    const removeListener = router.block((location: any) => {
      if (!isDirty()) {
        return undefined;
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
      <Render store={current.current} />
      {children}
    </form>
  );
};

export const StatelessForm = ({
  children,
  onSubmit,
  ...props
}: Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & {
  onSubmit: (elements: HTMLFormControlsCollection) => void;
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event.currentTarget.elements);
  };

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
};
