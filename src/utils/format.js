export const formatDate = (value) => {
  const date = new Date(value);

  const remainingDays = Math.ceil((date - Date.now()) / 86400000);
  const possibleWeekday = date.toLocaleDateString("sk-SK", { weekday: "long" });

  let weekday;

  switch (true) {
    case remainingDays === -1:
      weekday = "včera";
      break;
    case remainingDays === 0:
      weekday = "dnes";
      break;
    case remainingDays === 1:
      weekday = "zajtra";
      break;
    case -7 < remainingDays && remainingDays < 0:
      weekday = `min. ${possibleWeekday}`;
      break;
    case 0 < remainingDays && remainingDays < 7:
      weekday = possibleWeekday;
      break;
  }

  let result = `${date.getDate()}. ${date.getMonth() + 1}.`;

  if (date.getFullYear() !== new Date().getFullYear()) {
    result += " " + date.getFullYear();
  }

  if (weekday) {
    result += ` (${weekday})`;
  }

  return result;
};
console.log(formatDate);
export const formatDates = (dates) => {
  if (dates.length === 1) {
    return formatDate(dates[0]);
  }

  return dates.sort().map(formatDate).join(" → ");
};
