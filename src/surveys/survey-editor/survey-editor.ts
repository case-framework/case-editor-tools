import { Survey, LocalizedString, SurveyItem, isSurveyGroupItem, SurveyGroupItem, SurveyContextDef, Expression } from "survey-engine/data_types";
import { Logger } from "../../logger/logger";
import { SurveyAvailableFor } from "../types";
import { NewItemProps } from "./data-types";
import { ItemEditor } from "./item-editor";

interface SurveyEditorInt {
  setSurveyName: (name: Array<LocalizedString>) => void;
  setSurveyDescription: (description: Array<LocalizedString>) => void;
  setSurveyDuration: (duration: Array<LocalizedString>) => void;
  setSurveyContextRules: (contextRules: SurveyContextDef) => void;
  setPrefillRules: (rules: Expression[]) => void;
  setAvailableFor: (value?: SurveyAvailableFor) => void;
  setRequireLoginBeforeSubmission: (value?: boolean) => void;
  setMetadata: (data?: {
    [key: string]: string
  }) => void;


  changeItemKey: (oldKey: string, newKey: string) => void;
  addNewSurveyItem: (itemProps: NewItemProps, parentKey?: string, atPosition?: number) => SurveyItem | undefined;
  updateSurveyItem: (item: SurveyItem) => void;
  removeItem: (key: string) => void;
  findSurveyItem: (itemKey: string) => SurveyItem | undefined;
  moveSurveyItem: (item: SurveyItem, destination: string) => void;


  getSurvey: () => Survey;
  getSurveyJSON: (pretty?: boolean) => string;
}

export class SurveyEditor implements SurveyEditorInt {
  private survey: Survey;
  private surveyKey: string;

  constructor(survey?: Survey) {
    if (survey) {
      this.survey = { ...survey };
      this.surveyKey = this.survey.surveyDefinition.key;
    } else {
      this.surveyKey = 'survey';
      this.survey = {
        props: {},
        versionId: '',
        surveyDefinition: {
          key: this.surveyKey,
          items: []
        }
      }
    }
  }

  setSurveyName(name: Array<LocalizedString>) {
    if (!this.survey.props) {
      this.survey.props = {};
    }
    this.survey.props.name = name;
  };

  setSurveyDescription(description: Array<LocalizedString>) {
    if (!this.survey.props) {
      this.survey.props = {};
    }
    this.survey.props.description = description;
  };

  setSurveyDuration(duration: Array<LocalizedString>) {
    if (!this.survey.props) {
      this.survey.props = {};
    }
    this.survey.props.typicalDuration = duration;
  };

  setMetadata(data?: { [key: string]: string; } | undefined) {
    this.survey.metadata = data;
  }

  setMaxItemPerPage(itemLimits: { small: number; large: number }) {
    this.survey.maxItemsPerPage = itemLimits;
  }

  setAvailableFor(value?: SurveyAvailableFor | undefined) {
    this.survey.availableFor = value;
  }

  setRequireLoginBeforeSubmission(value?: boolean | undefined) {
    this.survey.requireLoginBeforeSubmission = value;
  }

  setSurveyContextRules(contextRules: SurveyContextDef) {
    this.survey.contextRules = { ...contextRules };
  };

  setPrefillRules(rules: Expression[]) {
    this.survey.prefillRules = [...rules];
  };

  addNewSurveyItem(newItem: NewItemProps, parentKey?: string, atPosition?: number): SurveyItem | undefined {
    if (!parentKey) {
      newItem.itemKey = this.surveyKey + '.' + newItem.itemKey;

      if (this.survey.surveyDefinition.items.find(it => newItem.itemKey === it.key)) {
        Logger.criticalError('Duplicate key in survey: ' + newItem.itemKey);
        return undefined;
      }
      const item = (new ItemEditor(undefined, newItem)).getItem();

      if (atPosition !== undefined) {
        this.survey.surveyDefinition.items.splice(atPosition, 0, item);
      } else {
        this.survey.surveyDefinition.items.push(item);
      }
      return item;
    }
    const obj = this.findSurveyItem(parentKey);
    if (!obj) {
      console.warn('parent survey item cannot be found: ', parentKey);
      return
    }

    newItem.itemKey = parentKey + '.' + newItem.itemKey;
    if ((obj as SurveyGroupItem).items.find(it => newItem.itemKey === it.key)) {
      Logger.criticalError('Duplicate key in survey: ' + newItem.itemKey);
      return undefined;
    }
    const item = (new ItemEditor(undefined, newItem)).getItem();
    if (atPosition !== undefined) {
      (obj as SurveyGroupItem).items.splice(atPosition, 0, item);
    } else {
      (obj as SurveyGroupItem).items.push(item);
    }
    return item;
  }

  addExistingSurveyItem(surveyItem: SurveyItem, parentKey: string, atPosition?: number): SurveyItem | undefined {
    const parent = this.findSurveyItem(parentKey);
    if (!parent) {
      console.warn('parent survey item cannot be found: ', parentKey);
      return
    }
    if ((parent as SurveyGroupItem).items.find(it => surveyItem.key === it.key)) {
      Logger.criticalError('Duplicate key in survey: ' + surveyItem.key);
      return undefined;
    }
    if (atPosition !== undefined) {
      (parent as SurveyGroupItem).items.splice(atPosition, 0, surveyItem);
    } else {
      (parent as SurveyGroupItem).items.push(surveyItem);
    }
    return surveyItem;
  }

  changeItemKey(oldKey: string, newKey: string, ignoreReferences?: boolean) {
    if (oldKey === this.surveyKey) {
      this.surveyKey = newKey;
      this.survey.surveyDefinition = this.changeItemKeyForSubtree(this.survey.surveyDefinition, newKey) as SurveyGroupItem;
      return;
    }

    let obj = this.findSurveyItem(oldKey);
    if (!obj) {
      console.warn('survey item cannot be found: ', oldKey);
      return
    }
    obj = Object.assign(obj, this.changeItemKeyForSubtree(obj, newKey));

    if (!ignoreReferences) {
      // replace key in every expression of the survey
      // replace key in every follows
      console.warn('unimplemented UPDATING KEY REFERENCES');
    }
  };

  updateSurveyItem(item: SurveyItem) {
    if (item.key === this.surveyKey) {
      this.survey.surveyDefinition = {
        ...this.survey.surveyDefinition,
        ...item
      }
      return;
    }
    const ids = item.key.split('.');
    const parentIds = ids.slice(0, ids.length - 1);
    const parentKey = parentIds.join('.');

    const obj = this.findSurveyItem(parentKey);
    if (!obj) {
      console.warn('parent survey item cannot be found: ', parentKey);
      return
    }

    const index = (obj as SurveyGroupItem).items.findIndex(it => it.key === item.key);
    if (index < 0) {
      console.warn('survey item cannot be found: ', item.key);
      return;
    }
    (obj as SurveyGroupItem).items[index] = {
      ...(obj as SurveyGroupItem).items[index],
      ...item
    };
    return;
  };

  removeItem(key: string) {
    // <- error if item is not found
    console.warn('removeItem unimplemented');
    return;
  };

  moveSurveyItem(item: SurveyItem, destination: string) {
    console.warn('moveSurveyItem unimplemented');
    // error if destination not exists
    // change item key
    // change key for all children recursivly
  };

  findSurveyItem(itemKey: string): SurveyItem | undefined {
    const ids = itemKey.split('.');
    const paths = this.getKeyListForPath(ids);

    let obj: SurveyItem | undefined = undefined;
    for (const currentKey of paths) {
      if (!obj) {
        obj = this.survey.surveyDefinition;
        continue;
      }
      if (!isSurveyGroupItem(obj)) {
        console.warn('survey item is not a group: ', obj.key);
        return;
      }
      const index = obj.items.findIndex(it => it.key === currentKey);
      if (index < 0) {
        console.warn('survey item cannot be found: ', currentKey);
        return;
      }
      obj = (obj.items[index] as SurveyGroupItem);
    }
    return obj;
  };

  getSurvey(): Survey {
    return { ...this.survey };
  };

  getSurveyJSON(pretty?: boolean): string {
    return JSON.stringify(this.survey, undefined, pretty ? '  ' : undefined);
  };

  // Private methods:
  private getKeyListForPath(ids: string[]): string[] {
    const paths: string[] = [];
    let compID = '';
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (compID.length < 1) {
        compID = id;
      } else {
        compID += '.' + id;
      }
      paths.push(compID);
    }
    return paths;
  }

  private changeItemKeyForSubtree(currentItem: SurveyItem, newKey: string): SurveyItem {
    currentItem = { ...currentItem };
    if (isSurveyGroupItem(currentItem)) {
      currentItem.items = currentItem.items.map(item => {
        const newSubkey = newKey + '.' + item.key.slice(item.key.lastIndexOf('.') + 1);
        return this.changeItemKeyForSubtree(item, newSubkey);
      });
    }
    currentItem.key = newKey;
    return currentItem;
  }
}
