const HumanDate = ({ date, format = "sk-SK" }) => {
  const target_date = new Date(date);
  const remaining_days = Math.ceil((target_date - Date.now()) / 86400000);

  let humanized = "";
  if (remaining_days === -1) {
    humanized = "včera";
  } else if (remaining_days === 0) {
    humanized = "dnes";
  } else if (remaining_days === 1) {
    humanized = "zajtra";
  } else if (-7 < remaining_days && remaining_days < 7) {
    humanized = (remaining_days < -1 ? "min. " : "") + target_date.toLocaleDateString(format, { weekday: "long" });
  }
  
  let formated_date = target_date.toLocaleDateString(format);

  return humanized ? `${formated_date} (${humanized})` : formated_date;
};
export default HumanDate;
