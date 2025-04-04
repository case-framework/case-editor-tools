import { ComponentProperties, Expression, ItemGroupComponent } from "survey-engine/data_types";
import { ComponentEditor } from "../survey-editor/component-editor";
import { generateLocStrings } from "../utils/simple-generators";

export interface HeaderRow {
  role: 'headerRow',
  key: string;
  displayCondition?: Expression;
  disabled?: Expression;
  cells: Array<{
    role: 'text',
    key: string,
    content?: Map<string, string>,
    description?: Map<string, string>,
  }>
}
export interface RadioRow {
  role: 'radioRow',
  key: string;
  displayCondition?: Expression;
  disabled?: Expression;
  cells: Array<{
    role: 'label' | 'option',
    key: string,
    content?: Map<string, string>,
    description?: Map<string, string>,
  }>

}
export interface ResponseRowCell {
  role: 'label' | 'check' | 'input' | 'numberInput' | 'dropDownGroup',
  key: string,
  content?: Map<string, string>,
  description?: Map<string, string>,
  properties?: ComponentProperties;
  // for dropdown group
  items?: Array<{
    role: 'option',
    key: string,
    content?: Map<string, string>,
    disabled?: Expression;
    displayCondition?: Expression;
  }>
}

export interface ResponseRow {
  role: 'responseRow',
  key: string;
  content?: Map<string, string>,
  displayCondition?: Expression;
  disabled?: Expression;
  cells: Array<ResponseRowCell>
}

export type MatrixRow = HeaderRow | RadioRow | ResponseRow;

export const initMatrixQuestion = (
  key: string,
  rows: Array<MatrixRow>,
  order?: Expression,
): ItemGroupComponent => {
  // init group
  const groupEdit = new ComponentEditor(undefined, {
    key: key,
    isGroup: true,
    role: 'matrix',
  });

  groupEdit.setOrder(
    order ? order : {
      name: 'sequential'
    }
  );

  // init rows
  rows.forEach(rowDef => {
    const rowEditor = new ComponentEditor(undefined, {
      key: rowDef.key,
      role: rowDef.role,
    });




    if (rowDef.displayCondition) {
      rowEditor.setDisplayCondition(rowDef.displayCondition);
    }
    if (rowDef.disabled) {
      rowEditor.setDisabled(rowDef.disabled);
    }

    switch (rowDef.role) {
      case 'headerRow':
        rowDef.cells.forEach(cell => {
          const cellEditor = new ComponentEditor(undefined, {
            key: cell.key,
            role: cell.role,
          });
          if (cell.content) {
            cellEditor.setContent(generateLocStrings(cell.content));
          }

          if (cell.description) {
            cellEditor.setDescription(generateLocStrings(cell.description));
          }
          rowEditor.addItemComponent(cellEditor.getComponent());
        });
        break;
      case 'radioRow':
        rowDef.cells.forEach(cell => {
          const cellEditor = new ComponentEditor(undefined, {
            key: cell.key,
            role: cell.role,
          });
          if (cell.content) {
            cellEditor.setContent(generateLocStrings(cell.content));
          }

          if (cell.description) {
            cellEditor.setDescription(generateLocStrings(cell.description));
          }
          rowEditor.addItemComponent(cellEditor.getComponent());
        });
        break;
      case 'responseRow':
        if (rowDef.content) {
          rowEditor.setContent(generateLocStrings(rowDef.content));
        }
        rowDef.cells.forEach(cell => {
          const cellEditor = new ComponentEditor(undefined, {
            key: cell.key,
            role: cell.role,
          });
          if (cell.content) {
            cellEditor.setContent(generateLocStrings(cell.content));
          }
          if (cell.description) {
            cellEditor.setDescription(generateLocStrings(cell.description));
          }
          cellEditor.setProperties(cell.properties);
          if (cell.items) {
            cell.items.forEach(opt => {
              const cellOptionEditor = new ComponentEditor(undefined, {
                key: opt.key,
                role: opt.role,
              });
              if (opt.content) {
                cellOptionEditor.setContent(generateLocStrings(opt.content));
              }
              cellOptionEditor.setDisabled(opt.disabled);
              cellOptionEditor.setDisplayCondition(opt.displayCondition);
              cellEditor.addItemComponent(cellOptionEditor.getComponent());
            })
          }
          rowEditor.addItemComponent(cellEditor.getComponent());
        });
        break;
    }

    groupEdit.addItemComponent(rowEditor.getComponent());
  });

  return groupEdit.getComponent() as ItemGroupComponent;
}
