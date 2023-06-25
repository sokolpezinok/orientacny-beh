import { IonSpinner, IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';

export const FatalError = ({ text = '', error = '' }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <IonIcon size="large" className="text-rose-500" icon={alertCircleOutline} />
        <p className="ion-text-wrap font-bold text-rose-500">{text}</p>
        <p className="ion-text-wrap text-sm text-gray-700 dark:text-gray-400">{error}</p>
      </div>
    </div>
  );
};

export const Spinner = ({ name = 'circular' }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <IonSpinner color="primary" name={name} />
    </div>
  );
};
