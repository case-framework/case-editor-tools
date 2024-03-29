import { ConfidentialMode, Expression, ItemComponent } from "survey-engine/data_types";
import { responseGroupKey } from "../../constants/key-definitions";
import { ItemEditor } from "../survey-editor/item-editor";
import { DateDisplayComponentProp, ExpressionDisplayProp, StyledTextComponentProp } from "../types/item-properties";
import { expWithArgs, generateTitleComponent } from "./simple-generators";

export class SimpleQuestionEditor {
  editor: ItemEditor;
  key: string;

  constructor(
    parentKey: string,
    key: string,
    confidentialMode?: ConfidentialMode,
    metadata?: {
      [key: string]: string
    }
  ) {
    const itemKey = [parentKey, key].join('.');
    this.key = itemKey;
    this.editor = new ItemEditor(undefined, { itemKey: itemKey, isGroup: false });
    this.editor.setMetadata(metadata);
    this.editor.setConfidentialMode(confidentialMode)
  }

  getItem() {
    return this.editor.getItem();
  }

  setTitle(title: Map<string, string> | Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp>, description?: Map<string, string>, className?: string) {
    this.editor.setTitleComponent(
      generateTitleComponent(title, description, className)
    );
  }

  setCondition(exp: Expression) {
    this.editor.setCondition(exp);
  }

  addDisplayComponent(comp: ItemComponent, atPosition?: number) {
    this.editor.addDisplayComponent(comp, atPosition)
  }

  addHasResponseValidation() {
    this.editor.addValidation({
      key: 'r1',
      type: 'hard',
      rule: expWithArgs('hasResponse', this.key, responseGroupKey)
    });
  }

  setResponseGroupWithContent(content: ItemComponent) {
    const rg = this.editor.addNewResponseComponent({ role: 'responseGroup' });
    this.editor.addExistingResponseComponent(content, rg?.key);
  }
}
