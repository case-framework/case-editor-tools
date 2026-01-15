import { ComponentProperties, ConfidentialMode, Expression, ItemComponent, Validation } from "survey-engine/data_types";
import { Duration } from "../../types/duration";

export interface StyledTextComponentProp {
  content: Map<string, string>;
  className?: string;
}

export interface DateDisplayComponentProp {
  languageCodes: string[];
  date: Expression;
  dateFormat: string;
  className?: string;
}

export interface ExpressionDisplayProp {
  languageCodes: string[];
  expression: Expression;
  className?: string;
}

export const isDateDisplayComponentProp = (value: DateDisplayComponentProp | any): value is DateDisplayComponentProp => {
  return typeof (value) === 'object' && (value as DateDisplayComponentProp).date !== undefined && (value as DateDisplayComponentProp).dateFormat !== undefined && (value as DateDisplayComponentProp).languageCodes !== undefined;
}

export const isExpressionDisplayProp = (value: ExpressionDisplayProp | any): value is ExpressionDisplayProp => {
  return typeof (value) === 'object' && (value as ExpressionDisplayProp).expression !== undefined && (value as ExpressionDisplayProp).languageCodes !== undefined;
}

export interface OptionDef {
  key: string;
  role: string;
  content?: Map<string, string>;
  items?: Array<StyledTextComponentProp | ExpressionDisplayProp> | Array<OptionDef>;
  description?: Map<string, string>;
  displayCondition?: Expression;
  disabled?: Expression;
  style?: Array<{ key: string, value: string }>;
  optionProps?: ComponentProperties;
}

export interface GenericQuestionProps {
  parentKey: string;
  itemKey: string;
  version?: number;
  questionText: Map<string, string> | Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp>;
  questionSubText?: Map<string, string>;
  titleClassName?: string;
  helpGroupContent?: Array<{
    content: Map<string, string>,
    style?: Array<{ key: string, value: string }>,
  }>;
  condition?: Expression;
  topDisplayCompoments?: Array<ItemComponent>;
  bottomDisplayCompoments?: Array<ItemComponent>;
  isRequired?: boolean;
  footnoteText?: Map<string, string>;
  customValidations?: Array<Validation>;
  confidentialMode?: ConfidentialMode;
  metadata?: {
    [key: string]: string
  };
}


/**
 * Numeric Input
 */
export interface NumericInputProps {
  inputLabel: Map<string, string>;
  labelBehindInput?: boolean;
  componentProperties?: ComponentProperties;
  inputMaxWidth?: string;
  disabled?: Expression;
}

export type NumericInputQuestionProps = GenericQuestionProps & NumericInputProps;


/**
 * Date Input
 */
export interface DateInputProps {
  dateInputMode: 'YMD' | 'YM' | 'Y';
  inputLabelText?: Map<string, string>;
  placeholderText?: Map<string, string>;
  minRelativeDate?: {
    reference?: number | Expression;
    delta: Duration;
  };
  maxRelativeDate?: {
    reference?: number | Expression;
    delta: Duration;
  };
}

export type DateInputQuestionProps = DateInputProps & GenericQuestionProps;

/**
 * Time Input
 */
export interface TimeInputProps {
  inputLabelText?: Map<string, string>;
  labelBehindInput?: boolean;
  defaultValue?: string; // in form e.g. 13:30
  minTime?: string;
  maxTime?: string;
  step?: number; // seconds
}

export type TimeInputQuestionProps = TimeInputProps & GenericQuestionProps;


/**
 * Text Input
 */
export interface TextInputProps {
  placeholderText?: Map<string, string>;
  inputLabel?: Map<string, string>;
  inputMaxWidth?: string;
  className?: string;
  maxLength?: number; // number of charachters allowed
  disabled?: Expression;
  transformLetterCaseTo?: 'upper' | 'lower';
}

export type TextInputQuestionProps = TextInputProps & GenericQuestionProps;

export interface MultiLineTextInput extends GenericQuestionProps {
  inputLabelText?: Map<string, string>;
  placeholderText?: Map<string, string>;
  maxLength?: number;
}


/**
 * Cloze Question
 */
export interface ClozeProps {
  items: Array<OptionDef>;
}

export type ClozeQuestionProps = ClozeProps & GenericQuestionProps;

/**
 * Consent Question
 */
export interface ConsentProps {
  checkBoxLabel: Map<string, string> | Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp>;
  dialogTitle: Map<string, string>;
  dialogContent: Map<string, string>;
  acceptBtn: Map<string, string>;
  rejectBtn: Map<string, string>;
  className?: string;
}

export type ConsentQuestionProps = ConsentProps & GenericQuestionProps;


/**
 * Response Single Choice Likert Array
 */
export type ResponsiveSingleChoiceArrayVariant = 'horizontal' | 'vertical' | 'table';

export interface ResponsiveSingleChoiceScaleOptions {
    key: string;
    className?: string;
    content: Map<string, string> | Array<StyledTextComponentProp | ExpressionDisplayProp>;
}

export interface ResponsiveSingleChoiceRow {
  key: string;
  displayCondition?: Expression;
  content: Map<string, string> | Array<StyledTextComponentProp | ExpressionDisplayProp>;
  horizontalModeProps?: {
    labelPlacement?: 'none' | 'top' | 'bottom';
    className?: string;
  },
  verticalModeProps?: {
    className?: string;
  }
  tableModeProps?: {
    className?: string;
  }

}

export interface ResponsiveSingleChoiceArrayProps {
  scaleOptions: Array<ResponsiveSingleChoiceScaleOptions>,
  rows: Array<ResponsiveSingleChoiceRow>,
  defaultMode: ResponsiveSingleChoiceArrayVariant;
  responsiveModes?: {
    sm?: ResponsiveSingleChoiceArrayVariant;
    md?: ResponsiveSingleChoiceArrayVariant;
    lg?: ResponsiveSingleChoiceArrayVariant;
    xl?: ResponsiveSingleChoiceArrayVariant;
    xxl?: ResponsiveSingleChoiceArrayVariant;
  },
  rgClassName?: string;
  tableModeProps?: {
    className?: string;
    layout?: "fixed";
    firstColWidth?: string;
    optionHeaderClassName?: string;
    hideRowBorder?: boolean;
  },
  horizontalModeProps?: {
    hideRowBorder?: boolean;
  },
  verticalModeProps?: {
    hideRowBorder?: boolean;
    useReverseOptionOrder?: boolean;
  }
}
export type ResponsiveSingleChoiceArrayQuestionProps = GenericQuestionProps & ResponsiveSingleChoiceArrayProps;


export interface ResponsiveBipolarLikertScaleOption {
  key: string;
}

export interface ResponsiveBipolarLikertRow {
    key: string;
    startLabel: Map<string, string> | Array<StyledTextComponentProp | ExpressionDisplayProp>;
    endLabel: Map<string, string> | Array<StyledTextComponentProp | ExpressionDisplayProp>;
    displayCondition?: Expression;
    withLabelRowModeProps?: {
      className?: string;
    },
    verticalModeProps?: {
      className?: string;
    }
    tableModeProps?: {
      className?: string;
    }
}

/**
 * Response Bipolar Likert Array
 */
export type ResponsiveBipolarLikertArrayVariant = 'withLabelRow' | 'vertical' | 'table';
export interface ResponsiveBipolarLikertArrayProps {
  scaleOptions: Array<ResponsiveBipolarLikertScaleOption>,
  rows: Array<ResponsiveBipolarLikertRow>,
  defaultMode: ResponsiveBipolarLikertArrayVariant;
  responsiveModes?: {
    sm?: ResponsiveBipolarLikertArrayVariant;
    md?: ResponsiveBipolarLikertArrayVariant;
    lg?: ResponsiveBipolarLikertArrayVariant;
    xl?: ResponsiveBipolarLikertArrayVariant;
    xxl?: ResponsiveBipolarLikertArrayVariant;
  },
  rgClassName?: string;
  tableModeProps?: {
    className?: string;
    layout?: "fixed";
    labelColWidth?: string;
    hideRowBorder?: boolean;
  },
  withLabelRowModeProps?: {
    hideRowBorder?: boolean;
    maxLabelWidth?: string;
    useBottomLabel?: boolean;
  },
  verticalModeProps?: {
    hideRowBorder?: boolean;
  }
}

export type ResponsiveBipolarLikertArrayQuestionProps = GenericQuestionProps & ResponsiveBipolarLikertArrayProps;


/**
 * Responsive Matrix
 */
export type ResponsiveMatrixResponseType = 'dropdown' | 'input' | 'numberInput';

export interface ResponsiveMatrixColumn {
   key: string, label: Map<string, string> | Array<StyledTextComponentProp | ExpressionDisplayProp> 
}

export interface ResponsiveMatrixRow {
    key: string,
    role: 'row' | 'category',
    label: Map<string, string> | Array<StyledTextComponentProp | ExpressionDisplayProp>,
    displayCondition?: Expression;
    className?: string,
  }

export interface ResponsiveMatrixProps {
  responseType: ResponsiveMatrixResponseType;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  columns: Array<ResponsiveMatrixColumn>;
  // TODO: check if has double keys
  rows: Array<ResponsiveMatrixRow>;
  // TODO: check if has double keys
  dropdownConfig?: {
    unselectedLabeL: Map<string, string>;
    options: Array<{ key: string, label: Map<string, string> }>;
  };
}

export type ResponsiveMatrixQuestionProps = GenericQuestionProps & ResponsiveMatrixProps;
