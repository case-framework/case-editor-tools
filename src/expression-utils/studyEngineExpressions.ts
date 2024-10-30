import { Expression } from "survey-engine/data_types"
import { consentKey, multipleChoiceKey, responseGroupKey, singleChoiceKey } from "../constants/key-definitions"
import { Duration, durationObjectToSeconds } from "../types/duration"
import { generateExpression } from "./expressionGen"

const or = (...args: Expression[]): Expression => generateExpression('or', undefined, ...args)
const and = (...args: Expression[]): Expression => generateExpression('and', undefined, ...args)
const not = (arg: Expression): Expression => generateExpression('not', undefined, arg)

/**
 * Check if the current event has the given type
 * @param equalsType string with the possible values: 'ENTER', 'SUBMIT', 'TIMER', 'MERGE', 'LEAVE'
 * @returns if event type matches the argument, return true otherwise false
 */
const checkEventType = (equalsType: 'ENTER' | 'SUBMIT' | 'TIMER' | 'MERGE' | 'CUSTOM' | 'LEAVE') => generateExpression('checkEventType', undefined, equalsType)

/**
 * Check if the current event has the given key
 * @param equalsKey string
 * @returns if event key matches the argument, return true otherwise false
 */
const checkEventKey = (equalsKey: string) => generateExpression('checkEventKey', undefined, equalsKey);

/**
 * Check if the submitted survey has a specific key
 * @param surveyKey string to check for
 * @returns true, if the survey has the key, false otherwise
 */
const checkSurveyResponseKey = (surveyKey: string) => generateExpression('checkSurveyResponseKey', undefined, surveyKey);

/**
 * Check survey response item, if any of the defined option keys is present in the given response group
 * @param itemKey full key to the survey item, in the form, e.g., <surveyKey>.<groupKey>.<itemKey>
 * @param responseSlotKey full key to the response group, e.g., 'rg.scg'
 * @param optionKeys list of option keys to be checked for.
 * @returns true if any of the option keys are present in the item's response. If item or the response group is not found, return false.
 */
const responseHasKeysAny = (itemKey: string, responseSlotKey: string, ...optionKeys: string[]) => generateExpression('responseHasKeysAny', undefined, itemKey, responseSlotKey, ...optionKeys);

/**
 * Check survey response item, if only other keys have been selected
 * @param itemKey full key to the survey item, in the form, e.g., <surveyKey>.<groupKey>.<itemKey>
 * @param responseSlotKey full key to the response group, e.g., 'rg.mcg'
 * @param optionKeys list of option keys to be checked for.
 * @returns true if a response key is present, but is not in the list defined by optionKeys. If item or the response group is not found, returns false.
 */
const responseHasOnlyKeysOtherThan = (itemKey: string, responseSlotKey: string, ...optionKeys: string[]) => generateExpression('responseHasOnlyKeysOtherThan', undefined, itemKey, responseSlotKey, ...optionKeys)

/**
 *
 * @param itemKey full key to the survey item, in the form, e.g., <surveyKey>.<groupKey>.<itemKey>
 * @param responseKey  full key to the response that should exists
 * @returns if item contains responseKey return true
 */
const hasResponseKey = (itemKey: string, responseKey: string): Expression => {
  return generateExpression('hasResponseKey', undefined, itemKey, responseKey);
}

/**
 *
 * @param itemKey full key to the survey item, in the form, e.g., <surveyKey>.<groupKey>.<itemKey>
 * @param responseKey full key to the response that should exists
 * @param value the response object with the above key should have this value
 * @returns if the response object exists and has the value return true
 */
const hasResponseKeyWithValue = (itemKey: string, responseKey: string, value: string): Expression => {
  return generateExpression('hasResponseKeyWithValue', undefined, itemKey, responseKey, value);
}

const getResponseValueAsNum = (itemKey: string, responseKey: string): Expression => {
  return generateExpression('getResponseValueAsNum', 'float', itemKey, responseKey);
}

const getResponseValueAsStr = (itemKey: string, responseKey: string): Expression => {
  return generateExpression('getResponseValueAsStr', 'string', itemKey, responseKey);
}

/**
 * Retrieve the selected keys from a response slot
 * @param itemKey full key to the survey item, in the form, e.g., <surveyKey>.<groupKey>.<itemKey>
 * @param responseKey key of the response slot, where keys should be retrieved from
 * @returns
 */
const getSelectedKeys = (itemKey: string, responseKey: string): Expression => {
  return generateExpression('getSelectedKeys', 'string', itemKey, responseKey);
}

const countResponseItems = (itemKey: string, responseKey: string): Expression => {
  return generateExpression('countResponseItems', undefined, itemKey, responseKey);
}

/**
 * Method to run a check on previous responses of the participant.
 * @param condition expression that will be evaluated on each retrieved response
 * @param checkType - optional - 'all'/'any'/<number>: determines how to calculate the final value of the check. Default: 'all'. 'all' means, all the retrieved responses need to fulfil the condition, otherwise the methods returns false. 'any' means at least one retrieved response needs to fulfil the condtion. In both cases, if there were no responses retrieved, returns false. If a number is given here, it means, at least this many response need to fulfil the condition.
 * @param surveyKey - optional - filter for responses of this survey.
 * @param querySince - optional - retrieve responses that were submitted later than this timestamp. Expressions need to return a timestamp, or hard coded numbers can be used as well.
 * @param queryUntil - optional - retrieve responses that were submitted before this timestamp. Expressions need to return a timestamp, or hard coded numbers can be used as well.
 * @returns true/false
 */
const checkConditionForOldResponses = (
  condition: Expression,
  checkType?: number | 'all' | 'any',
  surveyKey?: string,
  querySince?: number | Expression,
  queryUntil?: number | Expression,
): Expression => generateExpression('checkConditionForOldResponses', undefined, condition, checkType, surveyKey, querySince, queryUntil)

const hasEventPayload = (): Expression => generateExpression('hasEventPayload', undefined);
const hasEventPayloadKey = (key: string): Expression => generateExpression('hasEventPayloadKey', undefined, key);
const hasEventPayloadKeyWithValue = (key: string, value: string): Expression => generateExpression('hasEventPayloadKeyWithValue', undefined, key, value);
const getEventPayloadValueAsStr = (key: string): Expression => generateExpression('getEventPayloadValueAsStr', 'string', key);
const getEventPayloadValueAsNum = (key: string): Expression => generateExpression('getEventPayloadValueAsNum', 'float', key);

/**
 * Method to access the timestamp for when the participant entered the study
 * @returns timestamp
 */
const getStudyEntryTime = () => generateExpression('getStudyEntryTime');
const getStudyEntryTimeForIncoming = () => generateExpression('incomingState:getStudyEntryTime');

/**
 * Determines if a specific survey key is currently assigned to the participant.
 * @param surveyKey - string - key of the survey to check for.
 * @returns true if the participant has a survey with this surveyKey assigned, otherwise false.
 */
const hasSurveyKeyAssigned = (surveyKey: string) => generateExpression('hasSurveyKeyAssigned', undefined, surveyKey);
const hasSurveyKeyAssignedForIncoming = (surveyKey: string) => generateExpression('incomingState:hasSurveyKeyAssigned', undefined, surveyKey);

/**
 * Method to access the timestamp for a surveyKey is assigned from
 * @param surveyKey - string - key of the survey to check for.
 * @returns timestamp
 */
const getSurveyKeyAssignedFrom = (surveyKey: string) => generateExpression('getSurveyKeyAssignedFrom', undefined, surveyKey);
const getSurveyKeyAssignedFromForIncoming = (surveyKey: string) => generateExpression('incomingState:getSurveyKeyAssignedFrom', undefined, surveyKey);

/**
 * Method to access the timestamp for a surveyKey is assigned until
 * @param surveyKey - string - key of the survey to check for.
 * @returns timestamp
 */
const getSurveyKeyAssignedUntil = (surveyKey: string) => generateExpression('getSurveyKeyAssignedUntil', undefined, surveyKey);
const getSurveyKeyAssignedUntilForIncoming = (surveyKey: string) => generateExpression('incomingState:getSurveyKeyAssignedUntil', undefined, surveyKey);

/**
 * Check if a participant has a specific study status
 * @param status - string
 * @returns true/false
 */
const hasStudyStatus = (status: string) => generateExpression('hasStudyStatus', undefined, status);
const hasStudyStatusForIncoming = (status: string) => generateExpression('incomingState:hasStudyStatus', undefined, status);

/**
 * Check if a participant flag with specific value is present
 * @param key look up this flag
 * @param value and for this value
 * @returns return true if key - value pair (with case sensitive matching for both key and value) is present. If any of the two is different, or participant flags is empty, it returns false.
 */
const hasParticipantFlagKeyAndValue = (key: string, value: string) => generateExpression('hasParticipantFlag', undefined, key, value);
const hasParticipantFlagKeyAndValueForIncoming = (key: string, value: string) => generateExpression('incomingState:hasParticipantFlag', undefined, key, value);

/**
 * Check if a participant flag is present
 * @param key look up this flag
 * @returns return true if key is present. If any of the two is different, or participant flags is empty, it returns false.
 */
const hasParticipantFlagKey = (key: string) => generateExpression('hasParticipantFlagKey', undefined, key);
const hasParticipantFlagKeyForIncoming = (key: string) => generateExpression('incomingState:hasParticipantFlagKey', undefined, key);


/**
 * Retrieve the value of a participant flag
 * @param key look up this flag
 * @returns return the value or an empty string if not present
 */
const getParticipantFlagValue = (key: string) => generateExpression('getParticipantFlagValue', undefined, key);
const getParticipantFlagValueForIncoming = (key: string) => generateExpression('incomingState:getParticipantFlagValue', undefined, key);

// Convinience method to parse participant flag's value as a number
const getParticipantFlagValueAsNum = (key: string) => parseValueAsNum(
  getParticipantFlagValue(key)
);


/**
 * Checks if the participant has a message type assigned (at least one)
 * @param messageType
 * @returns return true if a message with the given message type is assigned
 */
const hasMessageTypeAssigned = (messageType: string) => generateExpression('hasMessageTypeAssigned', undefined, messageType);
const hasMessageTypeAssignedForIncoming = (messageType: string) => generateExpression('incomingState:hasMessageTypeAssigned', undefined, messageType);

/**
 * Retrieve the timestamp (scheduledFor) for a particular message type. Return 0 if not assigned.
 * @param messageType
 * @returns timestamp value or zero
 */
const getMessageNextTime = (messageType: string) => generateExpression('getMessageNextTime', undefined, messageType);
const getMessageNextTimeForIncoming = (messageType: string) => generateExpression('incomingState:getMessageNextTime', undefined, messageType);

/**
 * Retrieve the timestamp of the last submission
 * @param surveyKey - optional - check for this specific survey key. If empty, it would check for all the submissions.
 * @returns timestamp value or zero
 */
const getLastSubmissionDate = (surveyKey?: string) => generateExpression('getLastSubmissionDate', undefined, surveyKey);
const getLastSubmissionDateForIncoming = (surveyKey?: string) => generateExpression('incomingState:getLastSubmissionDate', undefined, surveyKey);


/**
 * Check if the last submission is older than the reference timestamp
 * @param reference look up this flag
 * @param surveyKey - optional - check for this specific survey key. If empty, it would check for all the submissions.
 * @returns boolean
 */
const lastSubmissionDateOlderThan = (reference: number | Expression, surveyKey?: string) => generateExpression('lastSubmissionDateOlderThan', undefined, reference, surveyKey);
const lastSubmissionDateOlderThanForIncoming = (reference: number | Expression, surveyKey?: string) => generateExpression('incomingState:lastSubmissionDateOlderThan', undefined, reference, surveyKey);

const eq = (val1: Expression | string | number, val2: Expression | string | number) => generateExpression('eq', undefined, val1, val2);
const lt = (val1: Expression | string | number, val2: Expression | string | number) => generateExpression('lt', undefined, val1, val2);
const lte = (val1: Expression | string | number, val2: Expression | string | number) => generateExpression('lte', undefined, val1, val2);
const gt = (val1: Expression | string | number, val2: Expression | string | number) => generateExpression('gt', undefined, val1, val2);
const gte = (val1: Expression | string | number, val2: Expression | string | number) => generateExpression('gte', undefined, val1, val2);

const sum = (...values : (Expression | number)[]) => generateExpression('sum', "float", ...values);
const neg = (value: Expression|number) => generateExpression("neg", "float", value);

/**
 * Generate a timestamp value (POSIX timestamp). T = T_ref + delta. If 'reference' is not defined, the current time will be used as a reference.
 * @param delta offset for the timestamp generation
 * @param reference optional - a hard coded number, or an expression that should retrieve a timestamp (e.g., surveys assigned from, or response to a date question)
 * @returns
 */
const timestampWithOffset = (delta: Duration, reference?: number | Expression) => generateExpression(
  'timestampWithOffset',
  undefined,
  durationObjectToSeconds(delta),
  reference ? reference : undefined
)

/**
 * Get the ISO week value for a timestamp (POSIX).
 * @param ts a hard coded number, or an expression that should retrieve a timestamp (e.g., surveys assigned from, or response to a date question)
 * @returns
 */
const getISOWeekForTs = (ts: number | Expression) => generateExpression(
  'getISOWeekForTs',
  undefined,
  ts
)

/**
 * Generate a timestamp value (POSIX timestamp) for the beginning of the week for the first time that is later than the reference and has the ISO week as defined in argument ISOWeek.
 * @param ISOWeek which ISO week should be used for the timestamp generation
 * @param reference optional - a hard coded number, or an expression that should retrieve a timestamp (e.g., surveys assigned from, or response to a date question)
 * @returns
 */
const getTsForNextISOWeek = (ISOWeek: number | Expression, reference?: number | Expression) => generateExpression(
  'getTsForNextISOWeek',
  undefined,
  ISOWeek,
  reference ? reference : undefined
)

/**
 * Attempt to parse the resolved argument's value as a number
 * @param valueRef resolve this argument, and try to parse this as number. Boolean value will result in error.
 * @returns
 */
const parseValueAsNum = (valueRef: Expression | string | number): Expression => {
  return generateExpression('parseValueAsNum', 'float', valueRef);
}


/**
 *
 * @param serviceName name of the external service endpoint that should be used (URL and API key are config of the service)
 * @param route optional route to be appended to the service URL
 * @param expectFloat optional flag if the response value is expected to be a float (number) - by default, string is expected
 * @returns
 */
const externalEventEval = (serviceName: string, route?: string, expectFloat?: boolean) => generateExpression(
  'externalEventEval',
  expectFloat ? 'float' : undefined,
  serviceName,
  route,
)

/**
 * Control flow method to use an if-else like structure
 * @param condition expression, return value interpreted as boolean
 * @param actionIfTrue if condition evaluates to true, this action will be performed.
 * @param actionIfFalse optional, if defined and the condition returns false, this action will be performed.
 * @returns
 */
const IF = (condition: Expression, actionIfTrue: Expression, actionIfFalse?: Expression): Expression => generateExpression('IF', undefined, condition, actionIfTrue, actionIfFalse)

/**
 * Perform a list of expressions / actions
 * @param args: list of expressions to be evaluated
 * @returns
 */
const DO = (...args: Expression[]): Expression => generateExpression('DO', undefined, ...args)

/**
 * Simple if statement (without else), that checks for the condition and executes the list of actions.
 * @param condition condition to check, return value interpreted as boolean
 * @param args list of actions to be performed if condition evaluates to true, otherwise they are ignored
 * @returns
 */
const IFTHEN = (condition: Expression, ...args: Expression[]): Expression => generateExpression('IFTHEN', undefined, condition, ...args)

/**
 * Update the participant's study status
 * @param status new status value
 * @returns
 */
const UPDATE_STUDY_STATUS = (status: string): Expression => generateExpression('UPDATE_STUDY_STATUS', undefined, status)

/**
 * Generate and store a new session id to the participant's state
 * @param status new status value
 * @returns
 */
const START_NEW_STUDY_SESSION = (): Expression => generateExpression('START_NEW_STUDY_SESSION', undefined)

/**
 * Add or update a participant flag
 * @param key
 * @param newValue: string, number or expression where result should be written in the flag's value
 * @returns
 */
const UPDATE_FLAG = (key: string, newValue: string | number | Expression) => generateExpression('UPDATE_FLAG', undefined, key, newValue)

const REMOVE_FLAG = (key: string) => generateExpression('REMOVE_FLAG', undefined, key);

const ADD_NEW_SURVEY = (surveyKey: string,
  category: 'immediate' | 'prio' | 'normal' | 'optional',
  activeFrom?: number | Expression,
  activeUntil?: number | Expression) => generateExpression('ADD_NEW_SURVEY', undefined, surveyKey, activeFrom !== undefined ? activeFrom : 0, activeUntil !== undefined ? activeUntil : 0, category)

const REMOVE_ALL_SURVEYS = () => generateExpression('REMOVE_ALL_SURVEYS')

/**
 * Add participant message
 * @param messageType message type
 * @param scheduledFor timestamp or expression returning a timestamp
 * @returns
 */
const ADD_MESSAGE = (messageType: string, scheduledFor: number | Expression) => generateExpression('ADD_MESSAGE', undefined, messageType, scheduledFor);

/**
 * Remove all messages scheduled for the participant
 * @returns
 */
const REMOVE_ALL_MESSAGES = () => generateExpression('REMOVE_ALL_MESSAGES', undefined);

/**
 * Remove all messages with this message type
 * @param messageType message type
 * @returns
 */
const REMOVE_MESSAGES_BY_TYPE = (messageType: string) => generateExpression('REMOVE_MESSAGES_BY_TYPE', undefined, messageType);

/**
 * Add a new notification message for the subscribed researchers
 * @param messageType message type
 * @returns
 */
const NOTIFY_RESEARCHER = (messageType: string, ...payload: Expression[] | string[]) => generateExpression('NOTIFY_RESEARCHER', undefined, messageType, ...payload);


const REMOVE_SURVEY_BY_KEY = (
  surveyKey: string,
  selector: 'first' | 'last' | 'all'
) => {
  if (selector === 'all') {
    return generateExpression('REMOVE_SURVEYS_BY_KEY', undefined, surveyKey);
  } else {
    return generateExpression('REMOVE_SURVEY_BY_KEY', undefined, surveyKey, selector);
  }
}

/**
 * Initialises or resets a report for the current event
 * @param reportKey key to be used for the report
 */
const INIT_REPORT = (
  reportKey: string,
) => {
  return generateExpression('INIT_REPORT', undefined, reportKey);
}

/**
 * Remove the report from the list of reports to be added at the end of the event
 * @param reportKey key of the report that should be removed
 * @returns
 */
const CANCEL_REPORT = (
  reportKey: string,
) => {
  return generateExpression('CANCEL_REPORT', undefined, reportKey);
}

/**
 * Remove the confidential responses with this key for the participant
 * @param key key of the confidential responses that should be removed
 * @returns
 */
const REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY = (
  key: string,
) => {
  return generateExpression('REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY', undefined, key);
}

/**
 * Remove all confidential responses for the participant
 * @returns
 */
const REMOVE_ALL_CONFIDENTIAL_RESPONSES = () => {
  return generateExpression('REMOVE_ALL_CONFIDENTIAL_RESPONSES', undefined);
}

/**
 * Update one value attribute in a report. If report was not initialized, one will be added to the list.
 * @param reportKey
 * @param attributeKey update / create this attribute in the report
 * @param value this should be the value for the given attribute
 * @param dtype optional dtype to set info for the app how to render this data.
 * @returns
 */
const UPDATE_REPORT_DATA = (
  reportKey: string,
  attributeKey: string,
  value: number | string | Expression,
  dtype?: 'date' | 'float' | 'int' | 'string' | 'rawMessage' | 'keyList'
) => {
  return generateExpression('UPDATE_REPORT_DATA', undefined, reportKey, attributeKey, value, dtype);
}

/**
 * Method to remove one attribute (key and value) from the report
 * @param reportKey
 * @param attributeKey
 * @returns
 */
const REMOVE_REPORT_DATA = (
  reportKey: string,
  attributeKey: string,
) => {
  return generateExpression('REMOVE_REPORT_DATA', undefined, reportKey, attributeKey);
}

const setReportIcon = (
  reportKey: string,
  icon: string,
) => {
  return UPDATE_REPORT_DATA(reportKey, 'icon', icon);
}

const setReportMessage = (
  reportKey: string,
  content: string,
  asTranslationKey?: boolean,
) => {
  return UPDATE_REPORT_DATA(reportKey, 'message', content, asTranslationKey ? undefined : 'rawMessage');
}

const setReportSummary = (
  reportKey: string,
  content: string,
  asTranslationKey?: boolean,
) => {
  return UPDATE_REPORT_DATA(reportKey, 'summary', content, asTranslationKey ? undefined : 'rawMessage');
}

/**
 * Method to call external event handler
 * @param serviceName name of the external service endpoint that should be used (URL and API key are config of the service)
 * @param route optional route to be appended to the service URL
 * @returns
 */
const EXTERNAL_EVENT_HANDLER = (
  serviceName: string,
  route?: string,
) => {
  return generateExpression('EXTERNAL_EVENT_HANDLER', undefined, serviceName, route);
}


// ##################
// Prefill rule methods:
const PREFILL_SLOT_WITH_VALUE = (
  itemKey: string,
  slotKey: string,
  value: string | number,
) => {
  return generateExpression('PREFILL_SLOT_WITH_VALUE', undefined, itemKey, slotKey, value);
}

const GET_LAST_SURVEY_ITEM = (
  surveyKey: string,
  itemKey: string,
  submittedLaterThan?: Duration,
) => {
  return generateExpression('GET_LAST_SURVEY_ITEM', undefined, surveyKey, itemKey, submittedLaterThan ? durationObjectToSeconds(submittedLaterThan) : undefined);
}


// ##################
// Context previous responses methods:
const LAST_RESPONSES_BY_KEY = (
  surveyKey: string,
  limit: number,
) => {
  return generateExpression('LAST_RESPONSES_BY_KEY', undefined, surveyKey, limit);
}

const ALL_RESPONSES_SINCE = (
  sinceTimestamp: number,
) => {
  return generateExpression('ALL_RESPONSES_SINCE', undefined, sinceTimestamp);
}

const RESPONSES_SINCE_BY_KEY = (
  sinceTimestamp: number,
  surveyKey: string,
) => {
  return generateExpression('RESPONSES_SINCE_BY_KEY', undefined, sinceTimestamp, surveyKey);
}



// ##################
// Extra methods:

const singleChoiceOptionsSelected = (itemKey: string, ...optionKeys: string[]) => generateExpression('responseHasKeysAny', undefined, itemKey, [responseGroupKey, singleChoiceKey].join('.'), ...optionKeys)
const multipleChoiceOptionsSelected = (itemKey: string, ...optionKeys: string[]) => generateExpression('responseHasKeysAny', undefined, itemKey, [responseGroupKey, multipleChoiceKey].join('.'), ...optionKeys)

const multipleChoiceAllOfTheseSelected = (itemKey: string, ...optionKeys: string[]) => and(
  ...optionKeys.map(option => generateExpression('responseHasKeysAny', undefined, itemKey, [responseGroupKey, multipleChoiceKey].join('.'), option))
);


const multipleChoiceOnlyOtherKeysSelected = (itemKey: string, ...optionKeys: string[]) => generateExpression('responseHasOnlyKeysOtherThan', undefined, itemKey, [responseGroupKey, multipleChoiceKey].join('.'), ...optionKeys)
const singleChoiceOnlyOtherOptionSelected = (itemKey: string, ...optionKeys: string[]) => generateExpression('responseHasOnlyKeysOtherThan', undefined, itemKey, [responseGroupKey, singleChoiceKey].join('.'), ...optionKeys)

const consentAcceptedCondition = (itemKey: string): Expression => {
  return hasResponseKey(itemKey, [responseGroupKey, consentKey].join('.'))
}


const stopParticipation = () => UPDATE_STUDY_STATUS('inactive');
const finishParticipation = () => UPDATE_STUDY_STATUS('finished');

/**
 * If a survey is assigned with validFrom <= now and validUnil >= now
 * @param surveyKey which survey it should check for
 * @returns
 */
const hasSurveyKeyActive = (surveyKey: string) => {
  return and(
    lte(
      getSurveyKeyAssignedFrom(surveyKey),
      timestampWithOffset({ seconds: 1 })
    ),
    gte(
      getSurveyKeyAssignedUntil(surveyKey),
      timestampWithOffset({ seconds: -1 })
    ),
  )
}

/**
 * Results of "T_ref = reference + delta" will be checked against "validFrom" of the assinged survey (if present). True T_ref > T_validFrom.
 * @param surveyKey which survey it should check for
 * @param delta delta time to the reference time (by default current time).
 * @param reference optional reference time. If undefined it will take the current time.
 * @returns
 */
const hasSurveyKeyValidFromOlderThan = (surveyKey: string, delta: Duration, reference?: number | Expression) => {
  return lt(
    getSurveyKeyAssignedFrom(surveyKey),
    timestampWithOffset(delta, reference)
  );
}

/**
 * Results of "T_ref = reference + delta" will be checked against "validUntil" of the assinged survey (if present). True T_ref < T_validUntil.
 * @param surveyKey which survey it should check for
 * @param delta delta time to the reference time (by default current time).
 * @param reference optional reference time. If undefined it will take the current time.
 * @returns
 */
const hasSurveyKeyValidUntilSoonerThan = (surveyKey: string, delta: Duration, reference?: number | Expression) => {
  return gt(
    timestampWithOffset(delta, reference),
    getSurveyKeyAssignedUntil(surveyKey)
  );
}

export const NativeStudyEngineExpressions = {
  checkEventType,
  checkEventKey,
  // Response checkers
  checkSurveyResponseKey,
  responseHasKeysAny,
  responseHasOnlyKeysOtherThan,
  getResponseValueAsNum,
  getResponseValueAsStr,
  getSelectedKeys,
  hasResponseKey,
  hasResponseKeyWithValue,
  countResponseItems,
  // Old responses
  checkConditionForOldResponses,
  // Event payload methods:
  eventPayload: {
    hasEventPayload,
    hasEventPayloadKey,
    hasEventPayloadKeyWithValue,
    getEventPayloadValueAsStr,
    getEventPayloadValueAsNum,
  },
  // Participant state:
  participantState: {
    getStudyEntryTime,
    hasSurveyKeyAssigned,
    getSurveyKeyAssignedFrom,
    getSurveyKeyAssignedUntil,
    hasStudyStatus,
    hasParticipantFlagKeyAndValue,
    hasParticipantFlagKey,
    getParticipantFlagValue,
    getParticipantFlagValueAsNum,
    getLastSubmissionDate,
    lastSubmissionDateOlderThan,
    hasMessageTypeAssigned,
    getMessageNextTime,
    incomingParticipantState: {
      // for merge event
      getStudyEntryTime: getStudyEntryTimeForIncoming,
      hasSurveyKeyAssigned: hasSurveyKeyAssignedForIncoming,
      getSurveyKeyAssignedFrom: getSurveyKeyAssignedFromForIncoming,
      getSurveyKeyAssignedUntil: getSurveyKeyAssignedUntilForIncoming,
      hasStudyStatus: hasStudyStatusForIncoming,
      hasParticipantFlagKeyAndValue: hasParticipantFlagKeyAndValueForIncoming,
      hasParticipantFlagKey: hasParticipantFlagKeyForIncoming,
      getParticipantFlagValue: getParticipantFlagValueForIncoming,
      getLastSubmissionDate: getLastSubmissionDateForIncoming,
      lastSubmissionDateOlderThan: lastSubmissionDateOlderThanForIncoming,
      hasMessageTypeAssigned: hasMessageTypeAssignedForIncoming,
      getMessageNextTime: getMessageNextTimeForIncoming,
    }
  },
  // logical and comparision
  eq,
  lt,
  lte,
  gt,
  gte,
  or,
  and,
  not,
  sum,
  neg,
  // Other
  timestampWithOffset,
  getISOWeekForTs,
  getTsForNextISOWeek,
  parseValueAsNum,
  generateRandomNumber: (min: number, max: number) => generateExpression('generateRandomNumber', undefined, min, max),
  externalEventEval,
}

export const StudyEngineActions = {
  if: IF,
  do: DO,
  ifThen: IFTHEN,
  participantActions: {
    updateStudyStatus: UPDATE_STUDY_STATUS,
    startNewStudySession: START_NEW_STUDY_SESSION,
    updateFlag: UPDATE_FLAG,
    removeFlag: REMOVE_FLAG,
    assignedSurveys: {
      add: ADD_NEW_SURVEY,
      removeAll: REMOVE_ALL_SURVEYS,
      remove: REMOVE_SURVEY_BY_KEY,
    },
    reports: {
      init: INIT_REPORT,
      cancel: CANCEL_REPORT,
      updateData: UPDATE_REPORT_DATA,
      removeData: REMOVE_REPORT_DATA,
      // Extra methods:
      setReportIcon,
      setReportMessage,
      setReportSummary,

    },
    messages: {
      add: ADD_MESSAGE,
      removeAll: REMOVE_ALL_MESSAGES,
      remove: REMOVE_MESSAGES_BY_TYPE,
    },
    confidentialResponses: {
      removeByKey: REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY,
      removeAll: REMOVE_ALL_CONFIDENTIAL_RESPONSES,
    },
    externalEventHandler: EXTERNAL_EVENT_HANDLER,
    // Extra methods:
    stopParticipation,
    finishParticipation,
  },
  notifyResearcher: NOTIFY_RESEARCHER,
}

export const StudyEngine = {
  ...NativeStudyEngineExpressions,
  ...StudyEngineActions,
  singleChoice: {
    any: singleChoiceOptionsSelected,
    none: singleChoiceOnlyOtherOptionSelected
  },
  multipleChoice: {
    any: multipleChoiceOptionsSelected,
    none: multipleChoiceOnlyOtherKeysSelected,
    all: multipleChoiceAllOfTheseSelected,
  },
  consent: {
    accepted: consentAcceptedCondition,
  },
  survey: {
    isActive: hasSurveyKeyActive,
    validFromOlderThan: hasSurveyKeyValidFromOlderThan,
    validUntilSoonerThan: hasSurveyKeyValidUntilSoonerThan,
  },
  prefillRules: {
    PREFILL_SLOT_WITH_VALUE,
    GET_LAST_SURVEY_ITEM,
  },
  contextRules: {
    previousResponses: {
      LAST_RESPONSES_BY_KEY,
      ALL_RESPONSES_SINCE,
      RESPONSES_SINCE_BY_KEY,
    }
  }
}
