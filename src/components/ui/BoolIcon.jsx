import { IonIcon } from "@ionic/react";
import { checkmarkOutline, closeOutline } from "ionicons/icons";

const BoolIcon = ({ value, ...props }) => {
  return value ? <IonIcon className="text-emerald-500" icon={checkmarkOutline} {...props} /> : <IonIcon className="text-rose-500" icon={closeOutline} {...props} />;
};

export default BoolIcon;
