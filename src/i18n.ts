import resource from '@/locales';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    lng: 'vi', // if you're using a language detector, do not define the lng option
    fallbackLng: 'vi',
    debug: false,
    resources: resource,
    defaultNS: 'common',
    // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
    // set returnNull to false (and also in the i18next.d.ts options)
    // returnNull: false,
    // interpolation: {
    //   format: (value: unknown) => {
    //     console.log('value:', value);
    //     if (!isDate(value)) {
    //       return value as string;
    //     }
    //     return formatDate(value as Date, FORMAT_DATE);
    //   },
    // },
  })
  .catch(e => console.error(e));

export default i18next;
