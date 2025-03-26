import { getTreeListInstance, saveTreeListState } from '@/components/devex-tree-list';
import { DEV_EXTREME_STORAGE_KEY } from '@/constant';
import { Button, TreeList } from 'devextreme-react';
import {
  Column,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  ColumnFixing,
  Editing,
  FilterRow,
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
  TreeListRef,
} from 'devextreme-react/tree-list';
import dxTreeList, { dxTreeListColumn, dxTreeListRowObject } from 'devextreme/ui/tree_list';
import React, { useState } from 'react';

type ColumnBand = { name: string; columns?: ColumnBand[] };

type Props = {
  onAddNewClick?: () => void;
  onRefresh?: () => void;
  customToolbar?: React.ReactNode | React.ReactNode[];
  hideSerialNumber?: boolean;
  columnsBands?: ColumnBand[];
  onExporting?: (e: any) => void;
};

export const DevexTreeList = React.forwardRef<
  TreeListRef,
  React.PropsWithChildren<Props & React.ComponentProps<typeof TreeList>>
>(
  (
    {
      children,
      onRefresh,
      onAddNewClick,
      onExporting,
      customToolbar,
      hideSerialNumber,

      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(true);
    const storageKey = `${DEV_EXTREME_STORAGE_KEY}_${props.id}`;
    const treeListRef = React.useRef<dxTreeList>(null);
    const treeListInstance = getTreeListInstance(treeListRef);

    React.useImperativeHandle(ref, () => ({
      instance: () => treeListInstance as dxTreeList,
    }));

    const loadState = (): any => {
      const config = localStorage.getItem(storageKey);
      if (!config) return {};
      return JSON.parse(config);
    };

    const customSave = (state: any) => {
      saveTreeListState(storageKey, state, treeListInstance);
    };

    // const { trigger, errorsTable, downTemplateButton } = useImportExcel(importInfo);

    return (
      <>
        <TreeList
          keyExpr={'id'}
          id="Tree-list"
          columnAutoWidth
          allowColumnResizing
          allowColumnReordering
          showBorders
          showColumnLines
          showRowLines
          autoExpandAll={expanded}
          // rowAlternationEnabled
          ref={treeListRef}
          className="max-h-[calc(100vh-9.8rem)] !max-w-full"
          {...props}
        >
          <LoadPanel enabled={false} />
          <ColumnChooser enabled mode="select">
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
          {/* <Grouping autoExpandAll={expanded} contextMenuEnabled={true} expandMode="rowClick" /> */}
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
          {/* <GroupPanel visible /> */}
          {/* <FilterPanel visible /> */}
          <Editing confirmDelete allowUpdating allowDeleting allowAdding useIcons />
          <Toolbar>
            {/* <Item name="groupPanel" /> */}
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
            <Item>
              <Button icon="plus" onClick={onAddNewClick} />
            </Item>
            <Item location="after">
              <Button icon="refresh" onClick={onRefresh} />
            </Item>
            <Item location="after" name="columnChooserButton" />
            <Item>
              <Button icon="xlsxfile" onClick={onExporting} />
            </Item>
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
                column: dxTreeListColumn;
                columnIndex: number;
                component: dxTreeList;
                data: Record<string, any>;
                displayValue: any;
                oldValue: any;
                row: dxTreeListRowObject;
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
        </TreeList>
      </>
    );
  }
);
