import { BasicDialog } from '@/components/basic-dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
type DataTableModalErrorImportProps = {
  open: boolean;
  toggle: () => void;
  content: string;
};

function DialogShowMessegeAcceptNotify({ open, toggle, content }: DataTableModalErrorImportProps) {
  const { t } = useTranslation('user');
  return (
    <BasicDialog
      className="w-[300px]"
      open={open}
      toggle={toggle}
      title={t('page.notification.title')}
    >
      <div className=" ">
        <p>{content}</p>
        <div className="flex justify-end">
          <Button className="mt-3 h-6 self-end bg-primary-650" onClick={toggle}>
            <span className="text-white">Đóng</span>
          </Button>
        </div>
      </div>
    </BasicDialog>
  );
}

export default DialogShowMessegeAcceptNotify;
