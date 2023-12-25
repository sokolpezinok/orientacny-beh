import { IonIcon } from "@ionic/react";
import { checkmark, close } from "ionicons/icons";

const BoolIcon = ({ value, ...props }) => {
  return <IonIcon className={value ? "text-emerald-500" : "text-rose-500"} icon={value ? checkmark : close} {...props} />;
};
export default BoolIcon;
