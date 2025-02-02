import { category, group } from "@/utils/icons";
import { Share } from "@capacitor/share";
import { IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location, refresh, shareSocial } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";

import { Accordion, Anchor, BooleanIcon, Header, Item, ItemLink, ReadMore, Refresher, SadFace, SecondaryButton } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { getFirstEntry, getLastEntry, isFirstEntryExpired, isLastEntryExpired, sort } from "@/utils";
import { RaceApi } from "@/utils/api";
import { formatDate, formatDates } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => <Content Render={RaceDetail} updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])} errorText="Nepodarilo sa načítať preteky." />;

const RaceDetail = ({ content, handleUpdate }) => {
  const [detail, relations] = content;

  const { race_id } = useParams();
  const history = useHistory();
  const { smartModal, alertModal } = useModal();

  const handleShare = smartModal(async () => {
    const { value } = await Share.canShare();
    if (!value) throw "Zdielanie nie je dostupné.";

    // catch share cancel
    await Share.share({
      title: detail.name,
      text: `${detail.name}\n${detail.note}`,
      url: RaceApi.getRedirect(race_id),
      dialogTitle: detail.name,
    }).catch(() => null);
  }, "Nepodarilo sa zdielať.");

  const generateSignInLabel = () => {
    if (detail.cancelled) {
      return "Preteky sú zrušené";
    }

    if (isLastEntryExpired(detail.entries)) {
      return "Prihlasovanie skončilo";
    }

    const signedIn = relations[0].is_signed_in;
    const firstExpired = isFirstEntryExpired(detail.entries);
    const currentEntry = <span className="text-primary">{formatDate(firstExpired ? getLastEntry(detail.entries) : getFirstEntry(detail.entries))}</span>;

    if (firstExpired && !signedIn) {
      return (
        <>
          <span className="block">Vypršal prvý termín prihlásenia.</span>
          <span className="block">Posledný termín: {currentEntry}</span>
        </>
      );
    }

    return (
      <>
        {signedIn ? "Zmeniť / Odhlásiť sa" : "Prihlásiť sa"} do {currentEntry}
      </>
    );
  };

  const handleSignin = (user_id = null) => {
    if (detail.cancelled) {
      alertModal("Preteky sú zrušené", "Tieto preteky boli zrušené administrátorom.");
      return;
    }

    if (isLastEntryExpired(detail.entries)) {
      alertModal("Prihlásenie skončilo", "Vypršal posledný možný termín na prihlásenie.");
      return;
    }

    if (user_id === null) {
      return history.push(`/tabs/races/${race_id}/sign`);
    }

    return history.push(`/tabs/races/${race_id}/sign/${user_id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <Header backHref="/tabs/races" title="Podrobnosti">
          <IonButtons slot="primary">
            <IonButton onClick={handleUpdate}>
              <IonIcon slot="icon-only" icon={refresh} />
            </IonButton>
            <IonButton onClick={handleShare}>
              <IonIcon slot="icon-only" icon={shareSocial} />
            </IonButton>
          </IonButtons>
        </Header>
      </IonHeader>
      <IonContent>
        <Refresher handleUpdate={handleUpdate} />
        <div className="px-4 pt-4">
          <h1 className={classNames("text-2xl font-bold", detail.cancelled && "line-through")}>{detail.name}</h1>
          {detail.note && (
            <ReadMore>
              <p>{detail.note}</p>
            </ReadMore>
          )}
          {detail.link && <Anchor href={detail.link} />}
        </div>
        <Item>
          <div className="grid grid-cols-[auto_1fr] gap-4 md:grid-cols-[auto_1fr_auto_1fr]">
            <IonIcon icon={calendar} className="self-center text-2xl" color="primary" />
            {formatDates(detail.dates)}
            <IonIcon icon={location} className="self-center text-2xl" color="primary" />
            {detail.place}
            <IonIcon src={group} className="self-center text-2xl" color="primary" />
            {detail.club}
            <IonIcon src={category} className="self-center text-2xl" color="primary" />
            {detail.type}
            <IonIcon icon={bus} className="self-center text-2xl" color="primary" />
            {detail.transport ? "Organizovaná doprava" : "Vlastná doprava"}
            <IonIcon icon={home} className="self-center text-2xl" color="primary" />
            {detail.accommodation ? "Organizované ubytovanie" : "Vlastné ubytovanie"}
          </div>
        </Item>
        {Storage.pull().policies.policy_mng_big && <ItemLink routerLink={`/tabs/races/${race_id}/notify`}>Napísať notifikáciu</ItemLink>}
        <ItemLink routerLink="#" onClick={() => handleSignin()}>
          {generateSignInLabel()}
        </ItemLink>
        <IonAccordionGroup>
          {relations.length > 1 && (
            <Accordion title="Priradení členovia">
              {relations.map((item) => (
                <IonButton fill="clear" key={item.user_id} onClick={() => handleSignin(item.user_id)} className="w-full">
                  <div className="w-full text-left font-normal normal-case leading-normal">
                    <span>
                      <h2 className="mr-4 inline-block">{`${item.name} ${item.surname} (${item.chip_number})`}</h2>
                      <BooleanIcon value={item.is_signed_in} />
                    </span>
                    <p>{item.category ?? "-"}</p>
                  </div>
                </IonButton>
              ))}
            </Accordion>
          )}
          <Accordion title={`Prihlásení (${detail.everyone.length})`}>
            {detail.everyone.length > 0 ? (
              <div className="-mx-4 -mb-4 max-h-96 overflow-auto">
                <table className="w-full table-auto">
                  <thead className="border-b border-border text-left text-primary">
                    <tr>
                      <th className="sticky top-0 z-10 w-1/2 bg-background py-2 pl-4 font-medium">Meno</th>
                      <th className="sticky top-0 z-10 w-1/2 bg-background py-2 pl-4 font-medium">Kategória</th>
                      <th className="sticky top-0 z-10 bg-background py-2 pl-4 font-medium">{<IonIcon icon={bus} />}</th>
                      <th className="sticky top-0 z-10 bg-background px-4 py-2 font-medium">{<IonIcon icon={home} />}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sort(detail.everyone, (child) => child.surname).map((child) => (
                      <tr key={child.user_id} className="border-b border-border">
                        <td className="py-2 pl-4">{`${child.name} ${child.surname}`}</td>
                        <td className="py-2 pl-4">{child.category}</td>
                        <td className="py-2 pl-4">{<BooleanIcon value={child.transport} />}</td>
                        <td className="py-2 pl-4">{<BooleanIcon value={child.accommodation} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <SadFace title="Zatiaľ sa nikto neprihlásil." subtitle="Môžeš sa prihlásiť ako prvý/-á :)">
                <SecondaryButton onClick={() => handleSignin()}>Prihlásiť sa</SecondaryButton>
              </SadFace>
            )}
          </Accordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};
