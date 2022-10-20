export function getClientImageUrl (clientId) {
  return `${process.env.REACT_APP_API_URL}/clients/${clientId}/images`;
}

/**
 * 
 * @param {number} numberOfDays 
 * @param {('future'|'past')} time
 * @returns 
 */
export function daysFromNow (numberOfDays, time) {
  // const currentDate = new Date ();
  const date = new Date ();
  const pastDate = date.setDate (date.getDate () - numberOfDays);
  const futureDate = date.setDate (date.getDate () + numberOfDays);
  return time === 'past' ? pastDate : futureDate;
}
