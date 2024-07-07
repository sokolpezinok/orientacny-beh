import { IonBackButton, IonButton, IonButtons, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonTextarea, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import classNames from "classnames";
import { checkmark, chevronForwardOutline, close, openOutline } from "ionicons/icons";

export function ShortText({ children, ...props }) {
  return (
    <IonItem {...props}>
      <IonLabel>{children}</IonLabel>
    </IonItem>
  );
}

export function Text({ children, ...props }) {
  return (
    <IonItem {...props}>
      <IonLabel className="!whitespace-normal">{children}</IonLabel>
    </IonItem>
  );
}

export function Header({ children, backHref }) {
  return (
    <IonToolbar>
      {backHref && (
        <IonButtons slot="start">
          <IonBackButton defaultHref={backHref} />
        </IonButtons>
      )}
      <IonTitle>{children}</IonTitle>
    </IonToolbar>
  );
}

export function Title({ children, className }) {
  return <h1 className={classNames("mt-0 !font-bold", className)}>{children}</h1>;
}

export function Spacing({ children, className }) {
  return <div className={classNames("p-4", className)}>{children}</div>;
}

export function VerticalSpacing({ children, className }) {
  return <div className={classNames("flex flex-col gap-y-4", className)}>{children}</div>;
}

export function PrimaryButton({ children, type, className, ...props }) {
  return (
    <IonButton fill="solid" type={type ?? "button"} className={classNames("w-full", className)} {...props}>
      {children}
    </IonButton>
  );
}

export function SecondaryButton({ children, type, className, ...props }) {
  return (
    <IonButton fill="clear" type={type ?? "button"} className={classNames("w-full", className)} {...props}>
      {children}
    </IonButton>
  );
}

export function Input({ children, ...props }) {
  return <IonInput labelPlacement="floating" placeholder="..." {...props} />;
}

export function Textarea({ children, ...props }) {
  return (
    <IonTextarea labelPlacement="floating" placeholder="..." autoGrow={true} {...props}>
      {children}
    </IonTextarea>
  );
}

export function Select({ children, ...props }) {
  return (
    <IonSelect labelPlacement="floating" {...props}>
      {children}
    </IonSelect>
  );
}

export function Toggle({ children, ...props }) {
  return (
    <IonToggle labelPlacement="start" {...props}>
      {children}
    </IonToggle>
  );
}

export function ItemLink({ children, ...props }) {
  return (
    <IonItem {...props}>
      <IonLabel>{children}</IonLabel>
      <IonIcon slot="end" icon={chevronForwardOutline} />
    </IonItem>
  );
}

export function BasicLink({ children, href }) {
  const openLink = (e) => {
    e.preventDefault();
    return window.open(href);
  };

  const isValidLink = (link) => {
    let parsed;

    try {
      parsed = new URL(link);
    } catch {
      return false;
    }

    return parsed.protocol === "http:" || parsed.protocol === "https:";
  };

  if (!isValidLink(href)) {
    return children;
  }

  return (
    <a onClick={openLink} href={href} className="!dark:text-orange-700 !text-orange-600">
      {<IonIcon className="mr-1 align-text-top" icon={openOutline} />}
      {children ?? href}
    </a>
  );
}

export function Showcase({ children }) {
  return <div className="grid w-full grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4">{children}</div>;
}
Showcase.Item = ({ text, title, icon, src, onClick }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-orange-100 px-4 py-2 dark:bg-orange-950/[.5]" onClick={onClick}>
      <IonIcon src={src} icon={icon} className="hidden text-3xl xs:block" color="primary" />
      <div>
        <div className="flex items-center text-xl text-orange-600 dark:text-orange-700">{title}</div>
        <div>{text}</div>
      </div>
    </div>
  );
};

export const BooleanIcon = ({ value, ...props }) => {
  return <IonIcon className={value ? "text-emerald-500" : "text-rose-500"} icon={value ? checkmark : close} {...props} />;
};
