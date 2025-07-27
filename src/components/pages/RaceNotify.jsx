import { IonContent, IonPage } from "@ionic/react";
import { memo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Header, Input, ItemGroup, PrimaryButton, Textarea } from "@/components/ui/Design";
import { useModal } from "@/components/ui/Modals";
import { RaceApi } from "@/utils/api";
import { lazyDate } from "@/utils/format";
import { Storage } from "@/utils/storage";
import Content, { StatelessForm } from "../controllers/Content";

export default () => <Content Render={RaceNotify} fetchContent={({ race_id }) => RaceApi.detail(race_id)} />;

const RaceNotify = memo(({ content }) => {
  const { t } = useTranslation();
  const { race_id } = useParams();
  const { actionFeedbackModal, confirmModal } = useModal();

  const handleSubmit = actionFeedbackModal(async (elements) => {
    const data = {
      title: elements.title.value,
      image: elements.image.value,
      body: elements.body.value,
    };

    if (data.title.length === 0) {
      throw t("races.notify.fillTitle");
    }

    const surety = await confirmModal(t("races.notify.confirmSend", { club: Storage.pull().club.fullname }));

    if (!surety) {
      return;
    }

    await RaceApi.notify(race_id, data);
    return t("races.notify.sendSuccess");
  }, t("races.notify.sendError"));

  return (
    <IonPage>
      <Header defaultHref={`/tabs/races/${race_id}`} title={t("races.notify.title")} />
      <IonContent>
        <ItemGroup>
          <h2>{content.name}</h2>
        </ItemGroup>
        <ItemGroup title={t("races.notify.notification")} subtitle={t("races.notify.willReceiveImmediately")}>
          <Trans i18nKey="races.notify.notifyIsBoundToEvent" values={{ event: content.name }} components={[<b />]} />
        </ItemGroup>
        <StatelessForm onSubmit={handleSubmit}>
          <ItemGroup>
            <Input label={t("races.notify.titleLabel")} name="title" value={t("races.notify.titlePlaceholder")} required />
            <Input label={t("races.notify.imageUrlLabel")} name="image" value="" />
            <Textarea label={t("races.notify.bodyLabel")} name="body" value={t("races.notify.bodyPlaceholder", { date: lazyDate(content.entries[0]) })} />
          </ItemGroup>
          <ItemGroup>
            <PrimaryButton type="submit">{t("races.notify.send")}</PrimaryButton>
          </ItemGroup>
        </StatelessForm>
      </IonContent>
    </IonPage>
  );
});
