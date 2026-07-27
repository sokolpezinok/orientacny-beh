import { IonContent, IonPage } from "@ionic/react";
import isEqual from "fast-deep-equal";
import i18next from "i18next";
import { Store } from "pullstate";
import { ComponentType, createContext, FormEvent, FormHTMLAttributes, memo, ReactNode, RefObject, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { Fatal, Refresher, SkeletonPage } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";

type RenderComponentInner<T> = ComponentType<{ content: T; onUpdate: () => Promise<void> }>;
export type RenderComponent<T extends (params: any) => Promise<any>> = RenderComponentInner<Awaited<ReturnType<T>>>;

// memo() erases a component's own generics, so the generic function is defined
// separately and the memoized wrapper is cast back to its original signature.
const ContentInner = <T, P extends Record<string, string> = Record<string, string>>({
  Render,
  fetchContent,
  errorText,
}: {
  Render: RenderComponentInner<any>;
  fetchContent: (params: P) => Promise<T>;
  errorText?: string;
}) => {
  const { t } = useTranslation();
  const [content, setContent] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { errorModal, confirmModal } = useModal();
  const params = useParams<P>();
  const formRef = useRef<StatefulFormHandle>(null);

  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const handleUpdate = useCallback(async () => {
    if (formRef.current?.isDirty()) {
      const surety = await confirmModal(t("basic.confirmDiscardChanges"));

      if (!surety) {
        return;
      }
    }

    await fetchContent(params)
      .then((data) => {
        setContent(data);
      })
      .catch((error) => {
        if (content === null) setError(error);
        else errorModal(errorText || i18next.t("api.dataLoadError"), error);
      });
  }, [confirmModal, errorModal, content, errorText, fetchContent, params, t]);

  useEffect(() => {
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Fatal title={errorText || t("api.dataLoadError")} subtitle={error + ""}>
          {t("basic.pullToRefresh")}
        </Fatal>
      </IonContent>
    </IonPage>
  );
};

const Content = memo(ContentInner) as typeof ContentInner;

export default Content;

export type StatefulFormHandle = {
  submit: () => void;
  isDirty: () => boolean;
  discardChanges: () => void;
  acceptChanges: () => void;
};

const StatefulFormContext = createContext<RefObject<StatefulFormHandle | null> | null>(null);

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
  children?: ReactNode;
  Render: ComponentType<{ store: Store<S> }>;
  content: S;
  onSubmit: (value: S) => void;
}) => {
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
    // history passes the in-flight action directly, so there's no need to
    // read the (mutable) router.action after the confirm modal resolves.
    const removeListener = router.block((location, action) => {
      if (!isDirty()) {
        return undefined;
      }

      confirmModal(i18next.t("basic.confirmDiscardChanges")).then((value) => {
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
  }, [confirmModal, router]);

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
