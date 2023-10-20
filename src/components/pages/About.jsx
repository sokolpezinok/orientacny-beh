import { IonBackButton, IonButtons, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonAccordionGroup, IonAccordion } from "@ionic/react";
function About() {
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/settings" />
            </IonButtons>
            <IonTitle>O aplikácii</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel className="ion-text-wrap">
                <h1>Verzia</h1>
                <p>v2.0-beta</p>
              </IonLabel>
            </IonItem>
            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header">
                  <IonLabel className="ion-text-wrap">
                    <h1>Poďakovanie</h1>
                    <p>Ďakujem všetkým, ktorý akýmkoľvek spôsobom prispeli na vývoj aplikácie Orientačného behu.</p>
                  </IonLabel>
                </IonItem>
                <div slot="content">
                  <IonGrid className="mx-4 py-4">
                    <IonRow>
                      <IonCol className="text-gray-500">Vývojár</IonCol>
                      <IonCol className="text-right">Jurakin</IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol className="text-gray-500">Design</IonCol>
                      <IonCol className="text-right">OndrejH</IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol className="text-gray-500">Vytvorené pre</IonCol>
                      <IonCol className="text-right">Sokol Pezinok</IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              </IonAccordion>
              <IonAccordion>
                <IonItem slot="header">
                  <IonLabel className="ion-text-wrap">
                    <h1>Licencia</h1>
                    <p>
                      Aplikácia Orientačný beh je pod licenciou <b>MIT License</b>.
                    </p>
                  </IonLabel>
                </IonItem>
                <div slot="content">
                  <IonItem>
                    <IonLabel className="ion-text-wrap">
                      <h3 className="!mb-2">Copyright © 2023 Jurakin</h3>
                      <p className="!mb-2">
                        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software
                        without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
                        persons to whom the Software is furnished to do so, subject to the following conditions:
                      </p>
                      <p className="!mb-2">The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                      <p className="!mb-2">
                        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                        PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                        OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                      </p>
                    </IonLabel>
                  </IonItem>
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
}

export default About;
