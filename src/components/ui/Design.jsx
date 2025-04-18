import {
  IonAccordion,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  IonSelect,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import classNames from "classnames";
import { alertCircleOutline, checkmarkCircleOutline, chevronForward, clipboardOutline, closeCircleOutline, openOutline, sad } from "ionicons/icons";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useModal } from "./Modals";

export function Item({ children, className, innerPadding, ...props }) {
  return (
    <IonItem lines="full" style={Object.assign({ "--padding-start": "0" }, innerPadding || { "--inner-padding-end": "0" })} {...props}>
      <div className={classNames("w-full p-4", className)}>{children}</div>
    </IonItem>
  );
}

export function ItemGroup({ children, title, subtitle, className, ripple = false, ...props }) {
  // <div className={classNames("p-4", border && "border-outline-variant border-b")}></div>
  return (
    <div className={classNames("p-4", ripple && "ion-activatable pointer relative", className)} {...props}>
      {ripple && <IonRippleEffect />}
      {(title || subtitle) && (
        <div className="mb-2">
          <h4 className="text-on-background font-semibold">{title}</h4>
          <p>{subtitle}</p>
        </div>
      )}
      {children}
    </div>
  );
}

export function Accordion({ children, title, subtitle }) {
  return (
    <IonAccordion>
      <Item slot="header" innerPadding>
        <h4 className="text-on-background font-semibold">{title}</h4>
        <p>{subtitle}</p>
      </Item>
      <div slot="content" className="border-outline-variant border-b px-4 pb-4">
        {children}
      </div>
    </IonAccordion>
  );
}

export function Spacing({ children, innerPadding, topPadding, className, props }) {
  return (
    <div className={classNames("flex flex-col gap-y-4", innerPadding && "p-4", topPadding && "pt-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ReadMore({ children }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  return (
    <>
      <div ref={ref} className={expanded ? "" : "line-clamp-4"}>
        {children}
      </div>
      {/* display only first time and if text has has been clamped (height was is hardcoded) */}
      {!expanded && ref.current && ref.current.getBoundingClientRect().height >= 96 && (
        <Anchor className="block" onClick={() => setExpanded(true)} textOnly>
          Čítaj viac
        </Anchor>
      )}
    </>
  );
}

export function Header({ children, defaultHref, title }) {
  return (
    <IonToolbar>
      {defaultHref && (
        <IonButtons slot="start">
          <IonBackButton defaultHref={defaultHref} />
        </IonButtons>
      )}
      <IonTitle>{title}</IonTitle>
      {children}
    </IonToolbar>
  );
}

export function PrimaryButton({ children, type, className, ...props }) {
  // use w-full instead expand="full" to preserve round corners
  return (
    <IonButton fill="solid" className={classNames("m-0 w-full", className)} type={type ?? "button"} {...props}>
      {children}
    </IonButton>
  );
}

export function TransparentButton({ children, type, className, ...props }) {
  // use w-full instead expand="full" to preserve round corners
  return (
    <IonButton fill="clear" className={classNames("m-0 w-full", className)} type={type ?? "button"} {...props}>
      {children}
    </IonButton>
  );
}

export function OutlinedButton({ children, type, className, ...props }) {
  // use w-full instead expand="full" to preserve round corners
  return (
    <IonButton fill="outline" className={classNames("m-0 w-full", className)} type={type ?? "button"} {...props}>
      {children}
    </IonButton>
  );
}

export function InputLabel({ children, className, required, ...props }) {
  return (
    <div className={classNames("text-on-primary-container font-medium tracking-wider uppercase", className)} {...props}>
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </div>
  );
}

export function Input({ children, label, required, ...props }) {
  return (
    <IonInput labelPlacement="stacked" placeholder="..." required={required} {...props}>
      <InputLabel slot="label" required={required}>
        {label}
      </InputLabel>
      {children}
    </IonInput>
  );
}

export function Textarea({ children, label, required, ...props }) {
  return (
    <IonTextarea labelPlacement="stacked" placeholder="..." autoGrow={true} required={required} {...props}>
      <InputLabel slot="label" required={required}>
        {label}
      </InputLabel>
      {children}
    </IonTextarea>
  );
}

export function Select({ children, label, required, ...props }) {
  return (
    <IonSelect labelPlacement="stacked" placeholder="..." required={required} {...props}>
      <InputLabel slot="label" required={required}>
        {label}
      </InputLabel>
      {children}
    </IonSelect>
  );
}

export function Toggle({ children, className, required, ...props }) {
  return (
    <IonToggle justify="space-between" labelPlacement="start" className={classNames("w-full", className)} required={required} {...props}>
      <div className="whitespace-break-spaces">
        {children}
        {required && <span className="text-error ml-1">*</span>}
      </div>
    </IonToggle>
  );
}

export function Checkbox({ children, className, required, ...props }) {
  /* TODO: add separate label as a workaround to https://github.com/ionic-team/ionic-docs/issues/3459 */
  return (
    <IonCheckbox justify="space-between" className={classNames("w-full", className)} required={required} {...props}>
      <div className="whitespace-break-spaces">
        {children}
        {required && <span className="text-error ml-1">*</span>}
      </div>
    </IonCheckbox>
  );
}

export const Drawer = ({ children, active, className }) => {
  return (
    <div className="grid transition-[grid-template-rows]" style={{ gridTemplateRows: active ? "1fr" : "0fr" }}>
      <div className={classNames("overflow-hidden", className)}>{children}</div>
    </div>
  );
};

export function ItemLink({ children, style, ...props }) {
  return (
    <IonItem lines="full" style={Object.assign({ "--padding-start": "0" }, style)} {...props}>
      <div className="w-full p-4">{children}</div>
      <IonIcon slot="end" icon={chevronForward} />
    </IonItem>
  );
}

export const Anchor = forwardRef(function ({ children, className, href, textOnly, ...props }, ref) {
  return (
    (children || href) && (
      <a ref={ref} href={href} target="_blank" className={classNames("text-primary cursor-pointer", textOnly && "no-underline", className)} {...props}>
        {textOnly || <IonIcon icon={openOutline} className="mr-1 align-text-bottom" />}
        {children || href}
      </a>
    )
  );
});

export const Refresher = ({ onUpdate }) => {
  return (
    <IonRefresher slot="fixed" onIonRefresh={(event) => onUpdate().finally(event.detail.complete)}>
      <IonRefresherContent />
    </IonRefresher>
  );
};

export const Copyable = ({ text }) => {
  const { toastModal } = useModal();

  const handleClick = async () => {
    try {
      await window.navigator.clipboard.writeText(text);
      toastModal("Skopírované!");
    } catch (error) {
      toastModal("Nepodarilo sa skopírovať!");
    }
  };

  return (
    <span className="inline-flex cursor-pointer" onClick={handleClick}>
      <IonIcon icon={clipboardOutline} className="text-primary mr-2 self-center" />
      {text}
    </span>
  );
};

export const BooleanIcon = ({ value, className, ...props }) => {
  return <IonIcon className={classNames("align-middle text-2xl", value ? "text-success" : "text-error", className)} icon={value ? checkmarkCircleOutline : closeCircleOutline} {...props} />;
};

export const SmallWarning = ({ children, title }) => {
  return (
    <div className="bg-primary-container rounded-lg p-4">
      <div className="flex gap-4">
        <IonIcon icon={alertCircleOutline} className="text-on-primary-container text-2xl" />
        <p>{title}</p>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export const SmallSuccess = ({ children, title }) => {
  return (
    <div className="bg-success-container rounded-lg p-4">
      <div className="flex gap-4">
        <IonIcon icon={checkmarkCircleOutline} className="text-on-success-container text-2xl" />
        <p>{title}</p>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export const SmallError = ({ children, title }) => {
  return (
    <div className="bg-error-container rounded-lg p-4">
      <div className="flex gap-4">
        <IonIcon icon={closeCircleOutline} className="text-on-error-container text-2xl" />
        <p>{title}</p>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export const ColoredValue = ({ value, className, ...props }) => {
  return (
    <span className={classNames(value >= 0 ? "text-success" : "text-error", className)} {...props}>
      {value}
    </span>
  );
};

export const SadFace = ({ children, title = "", subtitle = "" }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon className="text-primary text-4xl" icon={sad} />
        <h4 className="text-primary font-bold">{title}</h4>
        <p className="text-sm">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export const Error = ({ children, title = "", subtitle = "" }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon className="text-error text-4xl" icon={alertCircleOutline} />
        <h4 className="text-error font-bold">{title}</h4>
        {subtitle && <p className="text-sm">{subtitle}</p>}
        {children && <div className="max-h-36 overflow-auto text-sm">{children}</div>}
      </div>
    </div>
  );
};

export const SpinnerPage = ({ name = "circular" }) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setState(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <IonSpinner color="primary" name={name} />
            <Drawer active={state}>
              <p>Táto akcia trvá dlhšie, ako sme očakávali.</p>
              <p>Za chvíľu to bude ...</p>
            </Drawer>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
