export const dateParse = (dateTime: Date) => {
  return Date.parse(dateTime.toString()).toString();
};
