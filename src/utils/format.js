import i18next from "i18next";

export const formatDate = (value) => {
  const convert = new Date(value);

  let result = `${convert.getDate()}. ${convert.getMonth() + 1}.`;

  if (convert.getFullYear() !== new Date().getFullYear()) {
    result += " " + convert.getFullYear();
  }

  return result;
};

export const formatTime = (value) => {
  const convert = new Date(value);

  return `${(convert.getHours() + "").padStart(2, "0")}:${(convert.getMinutes() + "").padStart(2, "0")}:${(convert.getSeconds() + "").padStart(2, "0")}`;
};

export const formatDatetime = (value) => {
  return formatDate(value) + " " + formatTime(value);
};

export const lazyDate = (value) => {
  const date = new Date(value);

  const remainingDays = Math.ceil((date - Date.now()) / 86400000);
  const possibleWeekday = date.toLocaleDateString("sk-SK", { weekday: "long" });

  let weekday;

  switch (true) {
    case remainingDays === -1:
      weekday = i18next.t("week.yesterday");
      break;
    case remainingDays === 0:
      weekday = i18next.t("week.today");
      break;
    case remainingDays === 1:
      weekday = i18next.t("week.tomorrow");
      break;
    case -7 < remainingDays && remainingDays < 0:
      weekday = i18next.t("week.last", { dayName: possibleWeekday });
      break;
    case 0 < remainingDays && remainingDays < 7:
      weekday = possibleWeekday;
      break;
  }

  let result = formatDate(value);

  if (weekday) {
    result += ` (${weekday})`;
  }

  return result;
};

export const lazyDates = (values) => {
  if (values.length === 1) {
    return lazyDate(values[0]);
  }

  return values.sort().map(lazyDate).join(" → ");
};

// This is not to prevent XSS attacks, React actually prevents XSS.
// This is only for visual purposes, because server allows HTML styling and React does not.
export const stripTags = (string) => string && string.replace(/<\/?[^>]+(>|$)/g, "");
