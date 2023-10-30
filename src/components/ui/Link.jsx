import {IonIcon} from "@ionic/react";
import { openOutline } from "ionicons/icons";

const Link = ({children, href}) => {
    const openLink = (e) => {
      e.preventDefault();
      return window.open(href);
    }
  
    if (!href) {
      return children;
    }
  
    return (
      <a onClick={openLink} href={href}>{<IonIcon className="align-text-top" icon={openOutline} />}{children}</a>
    );
}

export default Link;