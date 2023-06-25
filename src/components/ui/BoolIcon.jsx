import { IonIcon } from '@ionic/react';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

const BoolIcon = ({ bool, ...props }) => {
  return bool ? <IonIcon icon={checkmarkOutline} {...props} /> : <IonIcon icon={closeOutline} {...props} />;
};

export default BoolIcon;
