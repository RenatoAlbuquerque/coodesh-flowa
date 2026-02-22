import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export const formatToStrictISO = (dateString: string): string => {
  const inputFormat = 'ddd, DD MMM YYYY HH:mm:ss [GMT]';

  return dayjs(dateString, inputFormat).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
};
