import { category, directionsRun, group } from "@/utils/icons";
import { Share } from "@capacitor/share";
import { IonAccordionGroup, IonCol, IonGrid, IonIcon, IonLabel, IonRow } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location, logIn, shareSocial } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";

import { Accordion, Anchor, BooleanIcon, Header, Item, ItemLink, List, ReadMore, SadFace, SecondaryButton, Showcase } from "@/components/ui/Design";
import { isEntryExpired } from "@/utils";
import { RaceApi } from "@/utils/api";
import { formatDate } from "@/utils/format";
import { useModal } from "@/utils/modals";
import { Storage } from "@/utils/storage";
import Content from "../controllers/Content";

export default () => (
  <Content
    Render={RaceDetail}
    Header={() => <Header backHref="/tabs/races">Detail</Header>}
    updateData={({ race_id }) => Promise.all([RaceApi.detail(race_id), RaceApi.relations(race_id)])}
    errorText="Nepodarilo sa načítať preteky."
  />
);

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

  const handleSignin = (link) => (event) => {
    event.preventDefault();

    if (detail.cancelled) {
      alertModal("Nie je možné sa prihlásiť!", "Tieto preteky boli zrušené administrátorom.");
      return;
    }

    if (isEntryExpired(detail.entries)) {
      alertModal("Prihlásenie cez aplikáciu už nie je možné!", "Vypršal minimálny termín prihlášok. Pre prihlásenie kontaktuj organizátorov.");
      return;
    }

    history.push(link);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex w-full">
          <h1 className={classNames("flex-1 text-2xl font-bold", detail.cancelled && "line-through")}>{detail.name}</h1>
          <IonIcon className="cursor-pointer text-2xl" onClick={handleShare} icon={shareSocial} />
        </div>
        {detail.link && (
          <ReadMore>
            <p>{detail.note}</p>
          </ReadMore>
        )}
        {detail.link && <Anchor href={detail.link} />}
        {isEntryExpired(detail.entries) && <span className="text-sm text-rose-500">Vypršal minimálny termín prihlášok. Ak sa chceš prihlásiť, kontaktuj organizátorov.</span>}
      </div>
      <Item>
        <Showcase>
          <Showcase.Item label="Dátum" icon={calendar}>
            {detail.dates.sort().map(formatDate).join(" → ")}
          </Showcase.Item>
          <Showcase.Item label="Prihláška" icon={logIn} onClick={handleSignin(`/tabs/races/${race_id}/sign`)}>
            <a className="cursor-pointer">{formatDate(detail.entries.sort()[0])}</a>
          </Showcase.Item>
          <Showcase.Item label="Miesto" icon={location}>
            {detail.place}
          </Showcase.Item>
          <Showcase.Item label="Klub" src={group}>
            {detail.club}
          </Showcase.Item>
          <Showcase.Item label="Preprava" icon={bus}>
            {detail.transport ? "Organizovaná" : "Vlastná"}
          </Showcase.Item>
          <Showcase.Item label="Ubytovanie" icon={home}>
            {detail.accommodation ? "Organizované" : "Vlastné"}
          </Showcase.Item>
          <Showcase.Item label="Druh" src={category}>
            {detail.type}
          </Showcase.Item>
          <Showcase.Item label="Šport" src={directionsRun}>
            {detail.sport}
          </Showcase.Item>
        </Showcase>
      </Item>
      {Storage.pull().policies.policy_mng_big && <ItemLink routerLink={`/tabs/races/${race_id}/notify`}>Napísať notifikáciu</ItemLink>}
      <ItemLink routerLink="#" onClick={handleSignin(`/tabs/races/${race_id}/sign`)}>
        Prihlásiť sa
      </ItemLink>
      <IonAccordionGroup>
        <Accordion title="Moji členovia">
          <List>
            <SecondaryButton onClick={handleUpdate}>Aktualizovať zoznam</SecondaryButton>
            {relations.map((item) => (
              <IonLabel key={item.user_id} onClick={handleSignin(`/tabs/races/${race_id}/sign/${item.user_id}`)}>
                <h2>
                  {`${item.name} ${item.surname} (${item.chip_number})`}
                  <span className="ml-2">
                    <BooleanIcon value={item.is_signed_in} />
                  </span>
                </h2>
                <p>{item.category}</p>
              </IonLabel>
            ))}
          </List>
        </Accordion>
        <Accordion title={`Prihlásení (${detail.everyone.length})`}>
          <List>
            <SecondaryButton onClick={handleUpdate}>Aktualizovať zoznam</SecondaryButton>
            {detail.everyone.length > 0 ? (
              <IonGrid className="relative w-full">
                <IonRow className="sticky font-semibold text-primary">
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
                    <IonCol size="auto">
                      <BooleanIcon value={child.transport} />
                    </IonCol>
                    <IonCol size="auto">
                      <BooleanIcon value={child.accommodation} />
                    </IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            ) : (
              <div className="p-4">
                <SadFace title="Zatiaľ sa nikto neprihlásil." subtitle="Môžeš sa prihlásiť ako prvý/-á :)" />
              </div>
            )}
          </List>
        </Accordion>
      </IonAccordionGroup>
    </>
  );
};
