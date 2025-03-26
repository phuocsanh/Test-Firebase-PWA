/* eslint-disable @typescript-eslint/no-misused-promises */
import logo from '@/assets/images/logo.png';

import Button from 'devextreme-react/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { enterLabel } from '@/constant';
import { useAuth } from '@/hooks/use-auth';
import { useDomain } from '@/hooks/use-domain';
import { Footer } from '@/layout/footer';
import { SignInCredentials, authorizedSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const Login = () => {
  const { signIn } = useAuth();

  const { t } = useTranslation('signIn');

  useDomain();

  const methods = useForm<SignInCredentials>({
    defaultValues: {
      userName: '',
      password: '',
    },
    resolver: zodResolver(authorizedSchema),
  });

  return (
    <div className="h-screen bg-[url('./assets/images/bg-login.jpg')] bg-cover bg-no-repeat">
      <div
        className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0"
        style={{ height: 'calc(100% - var(--toastify-toast-max-height))' }}
      >
        <a
          href={'https://phanmemviet.com.vn/'}
          target="_blank"
          className="mb-6 flex items-center text-2xl font-semibold text-white"
          rel="noreferrer"
        >
          <img className="mr-2 aspect-[100/35] " src={logo} alt="logo" />
        </a>
        <div className="w-full rounded-lg bg-white ring-1 ring-[#7ec8eb] drop-shadow-lg sm:max-w-md md:mt-0 xl:p-0">
          <div className="p-6 sm:p-8">
            <Form {...methods}>
              <form
                onSubmit={async e => {
                  await methods.handleSubmit(signIn)(e);
                }}
                className=""
              >
                <div className="space-y-2">
                  <FormField name="userName" label={t('userName')}>
                    <Input
                      className="hover:ring-1"
                      placeholder={`${enterLabel} ${t('userName')}`}
                    />
                  </FormField>
                  <FormField name="password" label={t('password')}>
                    <Input
                      type="password"
                      className="hover:ring-1"
                      placeholder={`${enterLabel} ${t('password')}`}
                    />
                  </FormField>
                </div>
                <div className="mt-10">
                  <Button
                    className="w-full"
                    text={t('signIn')}
                    icon="login"
                    stylingMode="contained"
                    type="default"
                    useSubmitBehavior
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
