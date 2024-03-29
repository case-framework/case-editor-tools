import { SurveyGroupItem, SurveyItem } from "survey-engine/data_types";
import { Logger } from "../../logger/logger";
import { ItemEditor } from "../survey-editor/item-editor";
import { SurveyEditor } from "../survey-editor/survey-editor";
import { generateLocStrings, generatePageBreak } from "../utils/simple-generators";

export type SurveyAvailableFor = 'public' | 'temporary_participants' | 'active_participants' | 'participants_if_assigned';

export interface SurveyProps {
  surveyKey: string;
  name: Map<string, string>;
  description: Map<string, string>;
  durationText: Map<string, string>;
  availableFor?: SurveyAvailableFor;
  requireLoginBeforeSubmission?: boolean;
  // max item per page
  // set prefill rules
  // set context rules
}


export abstract class SurveyDefinition {
  key: string;
  editor: SurveyEditor;

  constructor(props: SurveyProps) {
    this.editor = new SurveyEditor();
    this.editor.changeItemKey('survey', props.surveyKey);
    this.key = props.surveyKey;

    // define name and description of the survey
    this.editor.setSurveyName(generateLocStrings(
      props.name
    ));

    this.editor.setSurveyDescription(generateLocStrings(
      props.description
    ));

    this.editor.setSurveyDuration(generateLocStrings(
      props.durationText
    ));

    this.editor.setAvailableFor(props.availableFor);
    this.editor.setRequireLoginBeforeSubmission(props.requireLoginBeforeSubmission);

    const rootItemEditor = new ItemEditor(this.editor.findSurveyItem(props.surveyKey) as SurveyGroupItem);
    rootItemEditor.setSelectionMethod({ name: 'sequential' });
    this.editor.updateSurveyItem(rootItemEditor.getItem());
  }

  abstract buildSurvey(): void;

  getSurvey() {
    this.buildSurvey();
    this.checkDuplicateChildKeys();
    return this.editor.getSurvey();
  }

  getSurveyJSON(pretty?: boolean) {
    this.buildSurvey();
    this.checkDuplicateChildKeys();
    return this.editor.getSurveyJSON(pretty);
  }

  addItem(item: SurveyItem, pageBreakAfter?: boolean) {
    this.editor.addExistingSurveyItem(item, this.key);
    if (pageBreakAfter) {
      this.addPageBreak();
    }
  }

  addPageBreak() {
    this.editor.addExistingSurveyItem(generatePageBreak(this.key), this.key);

  }

  addSurveyItemToPath(item: SurveyItem, parentKey: string) {
    this.editor.addExistingSurveyItem(item, parentKey);
  }

  private checkDuplicateChildKeys() {
    const group = this.editor.getSurvey().surveyDefinition;
    const keys = group.items.map(item => item.key);
    const hasDuplicates = keys.some((key, index) => {
      const isDuplicateKey = keys.indexOf(key) !== index;
      if (isDuplicateKey) {
        Logger.error('Duplicate key:');
        Logger.criticalError(`${key} is used twice (at index ${keys.indexOf(key)} and at index ${index})`);
      }
      return isDuplicateKey;
    });
    if (hasDuplicates) {
      Logger.error('\nSurvey item contains duplicate keys.\nPlease check the lines above for more infos.\nProcess stopped prematurely.')
      process.exit(1)
    }
  }
}
