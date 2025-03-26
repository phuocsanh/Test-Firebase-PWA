import { backLabel, saveLabel, saveTempLabel } from '@/constant/const';
import { useResize } from '@/hooks';
import { cn } from '@/lib/utils';
import Button from 'devextreme-react/button';
import { ClickEvent } from 'devextreme/ui/button';
import { useRef } from 'react';
import { CardContent, CardDescription, CardHeader } from './ui/card';
import { Separator } from './ui/separator';

type PageLayoutProps = {
  header?: string | React.ReactNode | React.ReactNode[];
  description?: string;
  children: React.ReactNode | React.ReactNode[];
  onDelete?: (e: ClickEvent) => void;
  onCancel?: (e: ClickEvent) => void;
  // onSaveChange?: MouseEventHandler<HTMLButtonElement>;
  onSaveChange?: (e: ClickEvent) => void;
  canSaveChange?: boolean;
  onSaveTemp?: (e: ClickEvent) => void;
  canSaveTemp?: boolean;
  isSaving?: boolean;
  customElementLeft?: JSX.Element | null;
  customElementRight?: JSX.Element | null;
  // statusName?: string | null;
  // statusNote?: string | null;
  contentClassName?: string;
};

export const PageLayout = ({
  header,
  description,
  // onDelete,
  onCancel,
  onSaveChange,
  canSaveChange,
  canSaveTemp,
  onSaveTemp,
  isSaving,
  children,
  customElementLeft,
  customElementRight,
  // statusName,
  // statusNote,
  contentClassName,
}: PageLayoutProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { height } = useResize<HTMLDivElement>(headerRef);

  return (
    <div aria-description="page-layout">
      <div
        ref={headerRef}
        className={cn(
          'space-y-3 pb-2 xl:mb-0',
          (onCancel || onSaveChange || canSaveChange) && 'mb-1'
        )}
      >
        {(header || description) && (
          <CardHeader className="flex-1 px-0 pb-0 pt-0">
            {/* <h3 className="text-t24 font-bold tracking-tight">{header}</h3> */}
            <h3 className="text-t11 font-bold tracking-tight">{header}</h3>
            {description && (
              <CardDescription className="pt-2 text-t14 text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </CardHeader>
        )}
        {(onCancel ||
          onSaveChange ||
          canSaveChange ||
          canSaveTemp ||
          onSaveTemp ||
          customElementLeft) && (
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-wrap gap-x-4">
              {customElementLeft}
              {onSaveTemp && (
                <Button
                  text={saveTempLabel}
                  className="uppercase"
                  stylingMode="contained"
                  type="default"
                  icon="save"
                  onClick={onSaveTemp}
                  disabled={isSaving || !canSaveTemp}
                />
              )}
              {onSaveChange && (
                <Button
                  text={saveLabel}
                  className="uppercase"
                  icon="save"
                  stylingMode="contained"
                  type="success"
                  onClick={onSaveChange}
                  disabled={isSaving || !canSaveChange}
                />
              )}
              {onCancel && (
                <Button
                  text={backLabel}
                  className="uppercase"
                  stylingMode="outlined"
                  type="default"
                  icon="arrowleft"
                  onClick={onCancel}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-x-4">{customElementRight}</div>
          </div>
        )}
      </div>
      <Separator />
      <CardContent
        className={cn(
          `relative overflow-y-auto px-0 pb-0 pt-1 md:p-1 lg:p-0 lg:pt-3`,
          contentClassName
        )}
        style={{ height: `calc(100vh -  ${(height ?? 34) + (50 + 32 + 12 * 2)}px)` }}
      >
        {children}
      </CardContent>
    </div>
  );
};
