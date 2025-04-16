import { IonContent, IonPage } from "@ionic/react";
import { useParams } from "react-router-dom";

import { Header, Input, ItemGroup, PrimaryButton, Textarea } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { RaceApi } from "@/utils/api";
import { lazyDate } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content, { StatelessForm } from "../controllers/Content";

export default () => <Content Render={RaceNotify} fetchContent={({ race_id }) => RaceApi.detail(race_id)} errorText="Nepodarilo sa načítať preteky." />;

const RaceNotify = ({ content }) => {
  const { race_id } = useParams();
  const { actionFeedbackModal, confirmModal } = useModal();

  const handleSubmit = actionFeedbackModal(async (elements) => {
    const data = {
      title: elements.title.value,
      image: elements.image.value,
      body: elements.body.value,
    };

    if (data.title.length === 0) {
      throw "Nezabudni vyplniť nadpis notifikácie.";
    }

    const surety = await confirmModal(`Naozaj sa chceš poslať notifikáciu celému klubu ${Storage.pull().club.fullname}?`);

    if (!surety) {
      return;
    }

    await RaceApi.notify(race_id, collected);
    return "Notifikácia bola úspešne odoslaná.";
  }, "Nepodarilo sa poslať notifikáciu.");

  return (
    <IonPage>
      <Header defaultHref={`/tabs/races/${race_id}`} title="Napísať notifikáciu" />
      <IonContent>
        <ItemGroup>
          <h2>{content.name}</h2>
        </ItemGroup>
        <ItemGroup title="Notifikácia" subtitle="Členovia tvojho klubu, ktorí majú povolene notifikácie, dostanú tvoju správu okamžite.">
          Táto notifikácia je viazaná na udalosť <b>{content.name}</b>, po kliknutí na notifikáciu sa automaticky otvorí.
        </ItemGroup>
        <StatelessForm onSubmit={handleSubmit}>
          <ItemGroup>
            <Input label="Nadpis" name="title" value="Pripomienka" required />
            <Input label="URL adresa obrázka (nepovinné)" name="image" value="" />
            <Textarea label="Obsah" name="body" value={`Už len ${lazyDate(content.entries[0])} sa dá prihlásiť. Nikto ďalší nechce ísť?`} />
          </ItemGroup>
          <ItemGroup>
            <PrimaryButton type="submit">Poslať celému klubu</PrimaryButton>
          </ItemGroup>
        </StatelessForm>
      </IonContent>
    </IonPage>
  );
};
