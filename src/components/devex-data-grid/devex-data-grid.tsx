import { saveDataGridState } from '@/components/devex-data-grid';
import { DEV_EXTREME_STORAGE_KEY } from '@/constant';
import { Button } from 'devextreme-react';
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  ColumnFixing,
  DataGridRef,
  Editing,
  FilterRow,
  Grouping,
  GroupPanel,
  HeaderFilter,
  Item,
  LoadPanel,
  Pager,
  Paging,
  Scrolling,
  Search,
  SearchPanel,
  StateStoring,
  Toolbar,
} from 'devextreme-react/data-grid';
import dxDataGrid, { dxDataGridColumn, dxDataGridRowObject } from 'devextreme/ui/data_grid';
import React, { useRef, useState } from 'react';

type ColumnBand = { name: string; columns?: ColumnBand[] };

type Props = {
  onAddNewClick?: () => void;
  onRefresh?: () => void;
  customToolbar?: React.ReactNode | React.ReactNode[];
  hideSerialNumber?: boolean;
  columnsBands?: ColumnBand[];
};

export function DevexDataGrid({
  children,
  // ref,
  onRefresh,
  onAddNewClick,
  customToolbar,
  hideSerialNumber: hideSerialNumber,
  ...props
}: React.PropsWithChildren & React.ComponentProps<typeof DataGrid> & Props) {
  const [expanded, setExpanded] = useState(true);
  const storageKey = `${DEV_EXTREME_STORAGE_KEY}_${props.id}`;
  const ref = useRef<DataGridRef>(null);

  const loadState = (): any => {
    const config = localStorage.getItem(storageKey);
    if (!config) return {};
    return JSON.parse(config);
  };

  const customSave = (state: any) => {
    saveDataGridState(storageKey, state, ref?.current?.instance());
  };

  return (
    <DataGrid
      keyExpr={'id'}
      ref={ref}
      id="dataGrid"
      columnAutoWidth
      allowColumnResizing
      allowColumnReordering
      showBorders
      showColumnLines
      showRowLines
      hoverStateEnabled
      // rowAlternationEnabled
      className="max-h-[calc(100vh-9.8rem)]"
      {...props}
    >
      <LoadPanel enabled={false} />
      <ColumnChooser enabled mode="select" height="45rem">
        <ColumnChooserSearch enabled />
        <ColumnChooserSelection allowSelectAll selectByClick recursive />
      </ColumnChooser>
      <FilterRow visible showOperationChooser />
      <Scrolling mode="standard" rowRenderingMode="standard" />
      <Paging enabled defaultPageSize={10} />
      <Pager
        visible
        showInfo
        showNavigationButtons
        showPageSizeSelector
        displayMode="adaptive"
        allowedPageSizes={[5, 10, 50, 100, 'all']}
      />
      <Grouping autoExpandAll={expanded} contextMenuEnabled={true} expandMode="rowClick" />
      <StateStoring
        enabled
        type="custom"
        storageKey={storageKey}
        // customSave={state => {
        //   console.log('state:', state);
        // }}
        customLoad={loadState}
        customSave={customSave}
      />
      <HeaderFilter visible>
        <Search enabled mode="contains" />
      </HeaderFilter>
      <SearchPanel visible />
      <GroupPanel visible />
      {/* <FilterPanel visible /> */}
      <Editing confirmDelete allowUpdating allowDeleting allowAdding useIcons />
      <Toolbar>
        <Item name="groupPanel" />
        <Item location="after">
          <Button
            // text={expanded ? 'Collapse All' : 'Expand All'}
            icon={expanded ? 'chevrondown' : 'chevronleft'}
            onClick={() => setExpanded(prevExpanded => !prevExpanded)}
          />
        </Item>
        {/* <Item> */}
        {/*   <Button */}
        {/*     type="normal" */}
        {/*     text="Reset" */}
        {/*     onClick={() => (ref as RefObject<DataGridRef>)?.current?.instance().state(null)} */}
        {/*   /> */}
        {/* </Item> */}
        {customToolbar}
        {onAddNewClick && (
          <Item>
            <Button icon="plus" onClick={onAddNewClick} />
          </Item>
        )}
        <Item location="after">
          <Button icon="refresh" onClick={onRefresh} />
        </Item>
        <Item name="columnChooserButton" />
        <Item name="exportButton" />
        {/* <Item name="searchPanel" /> */}
      </Toolbar>
      {/* <Column dataField="branchName" /> */}
      <ColumnFixing enabled />
      {!hideSerialNumber && (
        <Column
          dataField="serialNumber"
          caption="STT"
          dataType="number"
          format={',##0,##'}
          alignment="center"
          width={60}
          allowFiltering={false}
          allowSorting={false}
          cellRender={(cellInfo: {
            column: dxDataGridColumn;
            columnIndex: number;
            component: dxDataGrid;
            data: Record<string, any>;
            displayValue: any;
            oldValue: any;
            row: dxDataGridRowObject;
            rowIndex: number;
            rowType: string;
            text: string;
            value: any;
            watch: () => void;
          }) => {
            if (cellInfo.rowType === 'data') {
              return (
                cellInfo.component
                  .getVisibleRows()
                  .filter(item => item.rowType === 'data')
                  .indexOf(cellInfo.row) + 1
              );
            }
          }}
        />
      )}
      {children}
    </DataGrid>
  );
}
