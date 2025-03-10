import { useParams } from "react-router-dom";

import { Header, Input, Item, ItemGroup, PrimaryButton, Textarea } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { RaceApi } from "@/utils/api";
import { Storage } from "@/utils/storage";
import { IonContent, IonPage } from "@ionic/react";
import { useRef } from "react";
import Content from "../controllers/Content";

export default () => <Content Render={RaceNotify} updateData={({ race_id }) => RaceApi.detail(race_id)} errorText="Nepodarilo sa načítať preteky." />;

const RaceNotify = ({ content }) => {
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
    <IonPage>
      <Header defaultHref={`/tabs/races/${race_id}`} title="Napísať notifikáciu" />
      <IonContent>
        <form ref={ref}>
          <Item>
            <h1 className="text-2xl font-bold">{content.name}</h1>
          </Item>
          <ItemGroup title="Notifikácia" subtitle="Môžeš napísať notifikáciu. Členovia klubu, ktorí majú nainštalovanú našu mobilnú aplikáciu, dostanú tvoju správu okamžite.">
            <Input label="Nadpis" name="title" value="Pripomienka" required />
            <Textarea label="Obsah" name="body" value="Už len dnes sa dá prihlásiť. Nikto ďalší nechce prísť?" />
            <PrimaryButton onClick={handleSubmit}>Poslať celému klubu</PrimaryButton>
          </ItemGroup>
        </form>
      </IonContent>
    </IonPage>
  );
};
