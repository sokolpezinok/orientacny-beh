import { IonItem, IonList } from "@ionic/react";
import { useParams } from "react-router-dom";

import { RaceApi } from "@/utils/api";
import { useModal } from "@/utils/modals";
import { Storage } from "@/utils/storage";
import { useRef } from "react";
import Content from "../controllers/Content";
import { Header, Input, PrimaryButton, Spacing, Text, Textarea, Title } from "../ui/Design";

export default () => (
  <Content
    Render={RaceNotify}
    Header={() => {
      const { race_id } = useParams();
      return <Header backHref={`/tabs/races/${race_id}`}>Napísať notifikáciu</Header>;
    }}
    updateData={({ race_id }) => RaceApi.detail(race_id)}
    errorText="Nepodarilo sa načítať preteky."
  />
);

const RaceNotify = ({ content }) => {
  const detail = content;

  const { race_id } = useParams();
  const { smartModal, confirmModal } = useModal();
  const ref = useRef(null);

  const handleSubmit = smartModal(async () => {
    const els = ref.current.elements;
    const collected = {
      title: els.title.value,
      body: els.body.value,
    };

    if (collected.title.length === 0) throw "Nezabudni vyplniť nadpis notifikácie.";

    const surety = await confirmModal(`Naozaj sa chceš poslať notifikáciu celému klubu ${Storage.pull().club.fullname}?`);
    if (!surety) return;

    await RaceApi.notify(race_id, collected);
    return "Notifikácia bola úspešne odoslaná.";
  }, "Nepodarilo sa poslať notifikáciu.");

  return (
    <form ref={ref}>
      <IonList>
        <Text>
          <Title>{detail.name}</Title>
          <p>Môžeš napísať notifikáciu. Členovia klubu, ktorí majú nainštalovanú našu mobilnú aplikáciu, dostanú tvoju správu okamžite.</p>
        </Text>
        <IonItem>
          <Input label="Nadpis" name="title" value="Pripomienka" />
        </IonItem>
        <IonItem>
          <Textarea label="Obsah" name="body" value="Už len dnes sa dá prihlásiť. Nikto ďalší nechce prísť?" />
        </IonItem>
        <Spacing>
          <PrimaryButton onClick={handleSubmit}>Poslať celému klubu</PrimaryButton>
        </Spacing>
      </IonList>
    </form>
  );
};
