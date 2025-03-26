import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';
import { useAuth } from '@/hooks/use-auth';
import { useBoolean } from '@/hooks/use-boolean';
import { BellRing, Lock, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordDialog } from './change-password-dialog';
import { requestNotificationPermission } from '@/firebase-init';
import { createPostMutateFn } from '@/services';
import { defaultValuesDevice, Device } from '@/types';
import { useMutate } from '@/hooks';
import { MUTATE } from '@/constant';
import DialogShowMessegeAcceptNotify from './dialog-show-messege-accept-notify';
import { useState } from 'react';

/**
 * HeaderAvatarDropdown component
 * TODO: show avatar user and any setting related user
 */
export const HeaderAvatarDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('user');

  const { user, signOut } = useAuth();
  const { state: openDialog, toggle: toggleDialog } = useBoolean();
  const [messgeNotify, setMessageNotify] = useState('');
  const { state: openChangePasswordDialog, toggle: toggleChangePasswordDialog } = useBoolean();

  const { mutateAsync: pushToken } = useMutate({
    mutationKey: [MUTATE.DEVICE],
    mutationFn: createPostMutateFn<Device>('device'),
  });

  // const handleEnableNotifications = async () => {
  //   await navigator.serviceWorker.ready.then(async () => {
  //     const token = await requestNotificationPermission();
  //     console.log('🚀 ~ handleEnableNotifications ~ token:', token);
  //     if (token) {
  //       const data = await pushToken({
  //         ...defaultValuesDevice,
  //         userId: String(user?.userId) || '',
  //         deviceToken: token,
  //       });

  //       if (data) {
  //         toggleDialog();
  //         setMessageNotify(t('page.notification.acceptNotifySuccess'));
  //       }
  //     } else {
  //       toggleDialog();
  //       setMessageNotify(t('page.notification.acceptNotifyFail'));
  //     }
  //   });
  // };
  // HeaderAvatarDropdown.tsx
  const handleEnableNotifications = async () => {
    console.log('Bi sao tha');
    try {
      const token = await requestNotificationPermission();
      if (token) {
        const data = await pushToken({
          ...defaultValuesDevice,
          userId: String(user?.userId) || '',
          deviceToken: token,
        });
        if (data) {
          toggleDialog();
          setMessageNotify(t('page.notification.acceptNotifySuccess'));
        }
      } else {
        toggleDialog();
        setMessageNotify(t('page.notification.acceptNotifyFail'));
      }
    } catch (error) {
      console.error('Error in handleEnableNotifications:', error);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatar name={user?.name ?? ''} src={user?.images ?? ''} className="h-9 w-9" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-xs font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.userName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                handleEnableNotifications().catch(() => {});
              }}
              className="text-xs"
            >
              <BellRing className="h4 mr-2 w-4" />
              <span>{t('page.headerAvatar.notify')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={toggleChangePasswordDialog} className="text-xs">
              <Lock className="h4 mr-2 w-4" />
              <span>{t('page.headerAvatar.changePass')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/user-profile')} className="text-xs">
              <User className="h4 mr-2 w-4" />
              <span>{t('page.headerAvatar.profile')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className="text-xs">
            <LogOut className="h4 mr-2 w-4" />
            <span>{t('page.headerAvatar.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordDialog open={openChangePasswordDialog} toggle={toggleChangePasswordDialog} />
      <DialogShowMessegeAcceptNotify
        open={openDialog}
        toggle={toggleDialog}
        content={messgeNotify}
      />
    </>
  );
};
