# Orientačný beh

Aplikácia na zjednodušenia prihlasovania na preteky zo stránky https://members.eob.cz/.

## Gallery

<img src="./images/1_list.png" width="45%"></img> <img src="./images/2_detail.png" width="45%"></img> <img src="./images/3_signin.png" width="45%"></img> <img src="./images/4_profile.png" width="45%"></img> 

## Inštalácia

```
git clone https://github.com/sokolpezinok/orientacny-beh && cd orientacny-beh

# install packages
npm install

# build project
npm run build

# add android platform
npm run add-android-platform
```

## Debug

* Web
```
npm run dev
```

Otvor `localhost:3000` vo svojom prehliadači. Zmeny v kóde sa automaticky prejavia na webe.

* Android

```
npm run build
```

Pripoj svoj android do počítača, povoľ `allow debugging` a spusť nasledovný príkaz. [Viac informácií](https://stackoverflow.com/a/71426608/14900791)

```
npm run android
```

## Build

* Android
```
npm run build
npm run compile-android
```

V Android Studio zvoľ `Build`->`Generate Signed Bundle / APK`.

## Licencia

Aplikácia `Orientačný beh` je pod licenciou **MIT License**.
