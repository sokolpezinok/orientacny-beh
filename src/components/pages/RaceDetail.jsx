import { Share } from "@capacitor/share";
import { IonAccordion, IonAccordionGroup, IonBackButton, IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location, logIn, refresh, shareSocial } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";

import { isEntryExpired } from "@/utils";
import { RaceApi } from "@/utils/api";
import { formatDate, formatDates } from "@/utils/format";
import { alertModal, errorModal } from "@/utils/modals";
import BoolIcon from "../ui/BoolIcon";
import Content from "../ui/Content";
import { category, directionsRun, group } from "../ui/CustomIcons";
import Link from "../ui/Link";
import { SadFace } from "../ui/Media";

export default () => (
  <Content Render={RaceDetail} Header={Header} updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])} errorText="Nepodarilo sa načítať preteky." />
);

const Header = ({}) => (
  <IonToolbar>
    <IonButtons slot="start">
      <IonBackButton defaultHref="/tabs/races" />
    </IonButtons>
    <IonTitle>Detail</IonTitle>
  </IonToolbar>
);

const RaceDetail = ({ content, handleUpdate }) => {
  const [detail, relations] = content;

  const { race_id } = useParams();
  const history = useHistory();

  const handleShare = async () => {
    const shareSupport = await Share.canShare();

    if (!shareSupport.value) return errorModal("Share is not avaible in browser.");

    await Share.share({
      title: detail.name,
      text: `${detail.name}\n${detail.note}`,
      url: RaceApi.get_redirect(race_id),
      dialogTitle: detail.name,
    });
  };

  return (
    <IonList>
      <IonItem>
        <IonLabel className="ion-text-wrap">
          <div className="flex w-full justify-between">
            <h1 className={classNames("mt-0 flex-1 !font-bold", detail.is_cancelled && "line-through")}>{detail.name}</h1>
            <IonIcon className="cursor-pointer text-2xl" onClick={handleShare} icon={shareSocial} />
          </div>
          {detail.note.length > 0 && <p className="!mt-4">{detail.note}</p>}
          {detail.link.length > 0 && <Link href={detail.link}>{detail.link}</Link>}
          {isEntryExpired(detail.entries) && <p className="!text-rose-500">Cez appku sa už nedá prihlásiť! Kontaktuj organizátorov.</p>}
        </IonLabel>
      </IonItem>
      <IonItem>
        <Showcase>
          <Showcase.Item title="Dátum" icon={calendar} text={formatDates(detail.dates.sort())} />
          <Showcase.Item title="Prihláška" icon={logIn} text={formatDate(detail.entries.sort()[0])} onClick={() => history.push(`/tabs/races/${race_id}/sign`)} />
          <Showcase.Item title="Miesto" icon={location} text={detail.place} />
          <Showcase.Item title="Klub" src={group} text={detail.club} />
          <Showcase.Item title="Preprava" icon={bus} text={detail.transport ? "Organizovaná" : "Vlastná"} />
          <Showcase.Item title="Ubytovanie" icon={home} text={detail.accommodation ? "Organizované" : "Vlastné"} />
          <Showcase.Item title="Druh" src={category} text={detail.type} />
          <Showcase.Item title="Šport" src={directionsRun} text={detail.sport} />
        </Showcase>
      </IonItem>
      <IonAccordionGroup>
        <IonAccordion>
          <IonItem slot="header">Moji členovia</IonItem>
          <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
            <UpdateButton handleUpdate={handleUpdate} />
            <div className="flex flex-col gap-y-4">
              {relations.map((item) => (
                <IonLabel
                  key={item.user_id}
                  onClick={() => (isEntryExpired(detail.entries) ? alertModal("eez appku sa už nedá prihlásiť!") : history.push(`/tabs/races/${race_id}/sign/${item.user_id}`))}
                >
                  <h2>
                    {item.name} {item.surname} ({item.chip_number})
                    <span className="ml-2">
                      <BoolIcon value={item.is_signed_in} />
                    </span>
                  </h2>
                  <p>{item.category}</p>
                </IonLabel>
              ))}
            </div>
          </div>
        </IonAccordion>
        <IonAccordion>
          <IonItem slot="header">Prihlásení ({detail.everyone.length})</IonItem>
          <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
            <UpdateButton handleUpdate={handleUpdate} />
            {detail.everyone.length > 0 ? (
              <IonGrid className="relative p-0">
                <IonRow className="sticky text-orange-600 dark:text-orange-700">
                  <IonCol>Meno</IonCol>
                  <IonCol>Priezvisko</IonCol>
                  <IonCol>Kategória</IonCol>
                  <IonCol size="auto">
                    <IonIcon icon={bus} />
                  </IonCol>
                  <IonCol size="auto">
                    <IonIcon icon={home} />
                  </IonCol>
                </IonRow>
                {detail.everyone.map((child, index) => (
                  <IonRow key={index}>
                    <IonCol>{child.name}</IonCol>
                    <IonCol>{child.surname}</IonCol>
                    <IonCol>{child.category}</IonCol>
                    {/* <IonCol>{child.note}</IonCol> */}
                    {/* <IonCol>{child.note_internal}</IonCol> */}
                    <IonCol size="auto">
                      <BoolIcon value={child.transport} />
                    </IonCol>
                    <IonCol size="auto">
                      <BoolIcon value={child.accommodation} />
                    </IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            ) : (
              <div className="p-4">
                <SadFace text="Zatiaľ sa nikto neprihlásil." subtext="Môžeš sa prihlásiť ako prvý/-á :)" />
              </div>
            )}
          </div>
        </IonAccordion>
      </IonAccordionGroup>
    </IonList>
  );
};

const Showcase = ({ children }) => {
  return <div className="grid w-full grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4">{children}</div>;
};
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

const UpdateButton = ({ handleUpdate }) => {
  return (
    <IonButton fill="clear" className="mb-4 w-full" onClick={handleUpdate}>
      <IonIcon slot="start" icon={refresh} />
      Aktualizovať zoznam
    </IonButton>
  );
};
