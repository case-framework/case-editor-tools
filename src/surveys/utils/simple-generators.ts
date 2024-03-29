import { LocalizedString, ItemComponent, ExpressionName, Expression, ItemGroupComponent, SurveySingleItem } from "survey-engine/data_types";
import { ComponentEditor } from "../survey-editor/component-editor";
import { DateDisplayComponentProp, ExpressionDisplayProp, isDateDisplayComponentProp, isExpressionDisplayProp, StyledTextComponentProp } from "../types/item-properties";
import { generateRandomKey } from "./randomKeyGenerator";

export const generateLocStrings = (translations: Map<string, string>): LocalizedString[] => {
  // console.log(translations);
  const locString = new Array<LocalizedString>();
  translations.forEach((value, key) => {
    const item: LocalizedString = {
      code: key,
      parts: [{ str: value }]
    };
    locString.push(item);
  });
  return locString;
}

export const generateDateDisplayComp = (key: string, item: DateDisplayComponentProp): ItemComponent => {
  // console.log(translations);
  const styleArray = [
    { key: 'dateFormat', value: item.dateFormat }
  ];
  if (item.className) {
    styleArray.push({ key: 'className', value: item.className })
  }
  const locString = new Array<LocalizedString>();
  const dateExp = item.date;
  item.languageCodes.forEach((code) => {
    const translatedItem: LocalizedString = {
      code: code,
      parts: [{ dtype: 'exp', exp: dateExp }]
    };
    locString.push(translatedItem);
  });
  return {
    key: key,
    role: 'dateDisplay',
    content: locString,
    style: styleArray,
  }
}

export const generateExpressionDisplayComp = (key: string, item: ExpressionDisplayProp): ItemComponent => {
  const styleArray = [];
  if (item.className) {
    styleArray.push({ key: 'className', value: item.className })
  }
  const locString = new Array<LocalizedString>();
  const exp = item.expression;
  item.languageCodes.forEach((code) => {
    const translatedItem: LocalizedString = {
      code: code,
      parts: [{ dtype: 'exp', exp: exp }]
    };
    locString.push(translatedItem);
  });
  return {
    key: key,
    role: 'text',
    content: locString,
    style: styleArray,
  }
}

export const generateTitleComponent = (content: Map<string, string> | Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp>, description?: Map<string, string>, className?: string): ItemComponent => {
  let items = undefined;
  let currentContent = undefined;

  if (Array.isArray(content)) {
    items = content.map((item, index) => {
      if (isDateDisplayComponentProp(item)) {
        return generateDateDisplayComp(index.toFixed(), item);
      }
      if (isExpressionDisplayProp(item)) {
        return generateExpressionDisplayComp(index.toFixed(), item);
      }
      return {
        key: index.toFixed(),
        role: 'text',
        content: generateLocStrings(item.content),
        style: item.className ? [{ key: 'className', value: item.className }] : undefined
      }
    })
  } else {
    currentContent = generateLocStrings(content);
  }

  const style = className ? [{ key: 'className', value: className }] : undefined;
  return {
    role: 'title',
    content: currentContent,
    items: items,
    style: style,
    description: description ? generateLocStrings(description) : undefined,
  };
}

export const generateHelpGroupComponent = (
  items: Array<{
    content: Map<string, string>,
    style?: Array<{ key: string, value: string }>,
  }>): ItemGroupComponent => {

  // init group
  const groupEdit = new ComponentEditor(undefined, {
    isGroup: true,
    role: 'helpGroup',
  });

  groupEdit.setOrder({
    name: 'sequential'
  });

  items.forEach(item => {
    const itemEditor = new ComponentEditor(undefined, {
      role: 'text',
    });
    itemEditor.setContent(generateLocStrings(item.content));
    if (item.style) {
      itemEditor.setStyles(item.style);
    }

    groupEdit.addItemComponent(itemEditor.getComponent());
  });
  return groupEdit.getComponent() as ItemGroupComponent;
}

export const expWithArgs = (name: ExpressionName, ...args: any[]): Expression => {
  return {
    name: name,
    data: args.filter(a => a !== undefined).map(arg => {
      if (typeof (arg) === 'string') {
        return {
          dtype: 'str',
          str: arg
        }
      } else if (typeof (arg) === 'number') {
        return {
          dtype: 'num',
          num: arg
        }
      }
      return {
        dtype: 'exp',
        exp: arg as Expression
      }
    })
  }
}

export const generatePageBreak = (parentKey: string, key?: string): SurveySingleItem => {

  return {
    key: parentKey + '.' + (key ? key : "PB_" + generateRandomKey(4)),
    type: 'pageBreak'
  };
}
