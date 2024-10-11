import { IonAccordion, IonBackButton, IonButton, IonButtons, IonCheckbox, IonIcon, IonInput, IonItem, IonSelect, IonSpinner, IonTextarea, IonTitle, IonToggle, IonToolbar } from "@ionic/react";
import classNames from "classnames";
import { alertCircle, checkmark, chevronForward, close, openOutline, sad, warning } from "ionicons/icons";
import { forwardRef, useEffect, useRef, useState } from "react";

export function Item({ children, className, innerPadding, ...props }) {
  return (
    <IonItem lines="full" style={Object.assign({ "--padding-start": "0" }, innerPadding || { "--inner-padding-end": "0" })} {...props}>
      <div className={classNames("w-full p-4", className)}>{children}</div>
    </IonItem>
  );
}

export function ItemGroup({ children, title, subtitle }) {
  return (
    <div className="border-b border-border p-4">
      <div className="mb-2">
        <h3 className="font-semibold text-typography-shade">{title}</h3>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

export function Accordion({ children, title, subtitle }) {
  return (
    <IonAccordion>
      <Item slot="header" innerPadding>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </Item>
      <div slot="content" className="border-b border-border px-4 pb-4">
        {children}
      </div>
    </IonAccordion>
  );
}

export function List({ children, innerPadding, topPadding, className, props }) {
  return (
    <div className={classNames("flex flex-col gap-y-2", innerPadding && "p-4", topPadding && "pt-2", className)} {...props}>
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

export function PrimaryButton({ children, type, ...props }) {
  // use w-full instead expand="full" to preserve round corners
  return (
    <IonButton fill="solid" className="m-0 w-full" type={type ?? "button"} {...props}>
      {children}
    </IonButton>
  );
}

export function SecondaryButton({ children, type, className, ...props }) {
  // use w-full instead expand="full" to preserve round corners
  return (
    <IonButton fill="clear" className="m-0 w-full" type={type ?? "button"} {...props}>
      {children}
    </IonButton>
  );
}

export function InputLabel({ children, className, required, ...props }) {
  return (
    <div className={classNames("font-medium uppercase tracking-wider text-typography-tint", className)} {...props}>
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
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
        {required && <span className="ml-1 text-rose-500">*</span>}
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
        {required && <span className="ml-1 text-rose-500">*</span>}
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
      <a ref={ref} href={href} target="_blank" className={classNames("cursor-pointer text-primary", textOnly && "no-underline", className)} {...props}>
        {textOnly || <IonIcon icon={openOutline} className="mr-1 align-text-bottom" />}
        {children || href}
      </a>
    )
  );
});

// export const Anchor = forwardRef(function ({ children, href, ...props }, ref) {
//   return (
//     <a ref={ref} target="_blank" href={href} {...props}>
// {/* {<IonIcon className="mr-1 align-text-top" icon={openOutline} />} */}
//       {children ?? href}
//     </a>
//   );
// });

export function Showcase({ children }) {
  return <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">{children}</div>;
}
Showcase.Item = ({ children, label, icon, src, onClick }) => {
  // use weak compoarision to accept nullish values
  if (!children) return;

  return (
    <div className="flex" onClick={onClick}>
      <IonIcon src={src} icon={icon} className="mr-4 hidden self-center text-3xl xs:block" color="primary" />
      <div className="flex flex-col self-center">
        <h1>{children || "-"}</h1>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

export const BooleanIcon = ({ value, ...props }) => {
  return <IonIcon className={value ? "text-emerald-500" : "text-rose-500"} icon={value ? checkmark : close} {...props} />;
};

export const SmallWarning = ({ children }) => {
  return (
    <div className="flex items-center gap-2">
      <IonIcon icon={warning} className="text-primary" />
      <p>{children}</p>
    </div>
  );
};

export const SadFace = ({ title = "", subtitle = "" }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon size="large" className="text-emerald-500" icon={sad} />
        <h3 className="font-bold text-emerald-500">{title}</h3>
        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export const FatalError = ({ title = "", subtitle = "", reload = true }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon size="large" className="text-rose-500" icon={alertCircle} />
        <h3 className="font-bold text-rose-500">{title}</h3>
        <p className="text-sm">{subtitle}</p>
        {reload && <p className="text-sm">Ak chceš skúsiť znova, potiahni zhora nadol.</p>}
      </div>
    </div>
  );
};

export const Spinner = ({ name = "circular" }) => {
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setCurrent(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonSpinner color="primary" name={name} />
        <Drawer active={current}>
          <p>Táto akcia trvá dlhšie, ako sme očakávali.</p>
          <p>Za chvíľu to bude ...</p>
        </Drawer>
      </div>
    </div>
  );
};
