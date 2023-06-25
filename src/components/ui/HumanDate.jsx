const HumanDate = ({ date, format = 'sk-SK' }) => {
  const target_date = new Date(date);
  const remaining_days = Math.ceil((target_date - Date.now()) / 86400000);

  let output = '';
  if (remaining_days === -1) {
    output = 'včera';
  } else if (remaining_days === 0) {
    output = 'dnes';
  } else if (remaining_days === 1) {
    output = 'zajtra';
  } else if (remaining_days === 0) {
    output = 'dnes';
  } else if (remaining_days < 7) {
    output = target_date.toLocaleDateString(format, { weekday: 'long' });
  }

  if (output !== '') {
    output += ', ';
  }

  output += target_date.toLocaleDateString(format);

  return output;
};
export default HumanDate;
