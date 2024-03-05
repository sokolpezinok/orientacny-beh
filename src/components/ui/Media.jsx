import { IonIcon, IonSpinner } from "@ionic/react";
import { alertCircle, sad } from "ionicons/icons";

export const FatalError = ({ text = "", error = "" }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon size="large" className="text-rose-500" icon={alertCircle} />
        <p className="ion-text-wrap font-bold text-rose-500">{text}</p>
        <p className="ion-text-wrap text-sm text-gray-700 dark:text-gray-400">{error}</p>
      </div>
    </div>
  );
};

export const SadFace = ({ text = "", subtext = "" }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon size="large" className="text-emerald-500" icon={sad} />
        <p className="ion-text-wrap font-bold text-emerald-500">{text}</p>
        <p className="ion-text-wrap text-sm text-gray-700 dark:text-gray-400">{subtext}</p>
      </div>
    </div>
  );
};

export const Spinner = ({ name = "circular" }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <IonSpinner color="primary" name={name} />
    </div>
  );
};
