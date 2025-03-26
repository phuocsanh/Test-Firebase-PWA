import { MUTATE, QUERIES } from '@/constant';
import { getCompletedPrintout, PrintDataSource } from '@/lib/print';
import { DEFAULT_COMPANY_ID } from '@/pages/company';
import { createQueryByIdFn, getRequest } from '@/services';
import { CompanyType, PrintForm } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrint = (
  type: string,
  dataSource?: PrintDataSource,
  size?: string,
  rowNumber?: number,
  isLoop?: boolean
) => {
  const ref = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const { data } = useQuery({
    queryKey: [QUERIES.PRINT_THEME, type],
    queryFn: () => {
      return getRequest<PrintForm>('/print-forms/get-print-theme', {
        params: { type, size: size || 'A4' },
      });
    },
    // staleTime: 60000,
    staleTime: 0,
  });

  const { data: companyInfo } = useQuery<CompanyType>({
    queryKey: [MUTATE.COMPANY, DEFAULT_COMPANY_ID],
    queryFn: async () =>
      await createQueryByIdFn<CompanyType>('company')(Number(DEFAULT_COMPANY_ID)),
    staleTime: Infinity,
  });

  const { htmlBody: htmlTemplate } = data || {};

  let loopHtmlTemplate = '';
  // xử lý loop chỗ này
  // bên chỉnh sửa mẩu in cần tạo mẫu xem file .../public/templates/mau_in_loop_dynamic.txt
  if (isLoop) {
    const numLoop = dataSource?.details?.length ?? 0;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTemplate ?? '', 'text/html');

    const loopTable = doc.getElementById('loopTable1') as HTMLTableElement;
    const belowLoopTable = doc.getElementById('belowLoopTable') as HTMLTableElement;

    if (loopTable != null) {
      for (let i = 1; i <= numLoop; i++) {
        // Clone the original table
        const clonedTable = loopTable?.cloneNode(true) as HTMLTableElement;
        // Set a new ID for each cloned table
        clonedTable.id = `loopTable${i}`;

        let clonedTableHTML = clonedTable.innerHTML;
        const placeholderRegex = /\{(.*?)\}/g;
        const variables = getReplaceStrings(clonedTableHTML, placeholderRegex);
        variables.forEach(variable => {
          clonedTableHTML = clonedTableHTML.replace(variable, variable.replace('1}', `${i}}`));
        });
        // Set the updated HTML back to the cloned table
        clonedTable.innerHTML = clonedTableHTML;

        if (i !== 1) belowLoopTable.parentNode?.insertBefore(clonedTable, belowLoopTable);
      }
    }
    const bodyElement = doc.body;
    // Convert the body (or any specific element) back to a string
    const stringRepresentation = documentToString(bodyElement);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loopHtmlTemplate = stringRepresentation.replace('<body>', '').replace('', '</body>');
  }

  const source = {
    ...dataSource,
    companyCode: companyInfo?.code,
    companyName: companyInfo?.name,
    companyAddress: companyInfo?.address ?? '',
    // companyEmail: companyInfo?.email ?? '',
    // companyWebsite: companyInfo?.website ?? '',
    companyDescription: companyInfo?.description,
    companyTaxCode: companyInfo?.taxCode,
    companyPhone: companyInfo?.phone,
    companyFax: companyInfo?.fax,
    // companyLegalName: companyInfo?.legalName ?? '',
    companyRepresentative: companyInfo?.representative,
    companyRepresentativePosition: companyInfo?.position,
    companyBankAccount: companyInfo?.bankAccount,
    // companyBankName: companyInfo?.bankName ?? '',
    companyBankNumber: companyInfo?.bankAccount,
  };

  const printoutElement = (
    <div
      ref={ref}
      // className="contentLayoutPrint"
      style={{ padding: 20 }}
      dangerouslySetInnerHTML={{
        __html:
          htmlTemplate !== undefined
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              getCompletedPrintout(
                isLoop ? loopHtmlTemplate : htmlTemplate,
                source,
                size || 'A4',
                rowNumber || 1
              )
            : '',
      }}
    />
  );

  return { handlePrint, printoutElement };
};

function documentToString(element: HTMLElement): string {
  return element.outerHTML;
}

const getReplaceStrings = (string: string, reg: RegExp) => {
  const result = [];
  let stringFind;
  do {
    stringFind = reg.exec(string);
    if (stringFind) {
      result.push(stringFind[0]);
    }
  } while (stringFind);
  return result;
};
