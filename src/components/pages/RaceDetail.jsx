import { Share } from "@capacitor/share";
import { IonAccordion, IonAccordionGroup, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow } from "@ionic/react";
import classNames from "classnames";
import { bus, calendar, home, location, logIn, shareSocial } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";

import { isEntryExpired } from "@/utils";
import { PolicyEnums, RaceApi } from "@/utils/api";
import { formatDate, formatDates } from "@/utils/format";
import { useModal } from "@/utils/modals";
import { Storage } from "@/utils/storage";
import { category, directionsRun, group } from "../../utils/icons";
import Content from "../controllers/Content";
import { BasicLink, BooleanIcon, Header, ItemLink, SecondaryButton, Showcase, Spacing, Text, Title, VerticalSpacing } from "../ui/Design";
import { SadFace } from "../ui/Media";

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

  return (
    <IonList>
      <Text>
        <div className="flex w-full justify-between">
          <Title className={classNames("flex-1", detail.cancelled && "line-through")}>{detail.name}</Title>
          <IonIcon className="cursor-pointer text-2xl" onClick={handleShare} icon={shareSocial} />
        </div>
        {detail.note.length > 0 && <p>{detail.note}</p>}
        {detail.link.length > 0 && <BasicLink href={detail.link} />}
        {isEntryExpired(detail.entries) && <p className="!text-rose-500">Cez appku sa už nedá prihlásiť! Kontaktuj organizátorov.</p>}
      </Text>
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
      {Storage.pull().policies.policy_mng === PolicyEnums.BIG_MANAGER && <ItemLink routerLink={`/tabs/races/${race_id}/notify`}>Napísať notifikáciu</ItemLink>}
      <ItemLink routerLink={`/tabs/races/${race_id}/sign`}>Prihlásiť sa</ItemLink>
      <IonAccordionGroup>
        <IonAccordion>
          <IonItem slot="header">Moji členovia</IonItem>
          <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
            <VerticalSpacing>
              <SecondaryButton onClick={handleUpdate}>Aktualizovať zoznam</SecondaryButton>
              {relations.map((item) => (
                <IonLabel
                  key={item.user_id}
                  onClick={() => (isEntryExpired(detail.entries) ? alertModal("Cez appku sa už nedá prihlásiť!") : history.push(`/tabs/races/${race_id}/sign/${item.user_id}`))}
                >
                  <h2>
                    {`${item.name} ${item.surname} (${item.chip_number})`}
                    <span className="ml-2">
                      <BooleanIcon value={item.is_signed_in} />
                    </span>
                  </h2>
                  <p>{item.category}</p>
                </IonLabel>
              ))}
            </VerticalSpacing>
          </div>
        </IonAccordion>
        <IonAccordion>
          <IonItem slot="header">{`Prihlásení (${detail.everyone.length})`}</IonItem>
          <div slot="content" className="bg-orange-50 p-4 dark:bg-transparent">
            <VerticalSpacing>
              <SecondaryButton onClick={handleUpdate}>Aktualizovať zoznam</SecondaryButton>
              {detail.everyone.length > 0 ? (
                <IonGrid className="relative w-full p-0">
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
                <Spacing>
                  <SadFace text="Zatiaľ sa nikto neprihlásil." subtext="Môžeš sa prihlásiť ako prvý/-á :)" />
                </Spacing>
              )}
            </VerticalSpacing>
          </div>
        </IonAccordion>
      </IonAccordionGroup>
    </IonList>
  );
};
