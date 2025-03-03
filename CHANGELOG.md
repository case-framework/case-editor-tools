# Changelog

## 1.6.10 - 2025-03-03

### Changed

- add study engine action `DRAW_STUDY_CODE_AS_LINKING_CODE`

## 1.6.9 - 2025-01-27

## Changed

- add study engine expressions helpers for `sum`, `neg`
- add study engine expressions helpers for `isStudyCodePresent` and `removeStudyCode`
- add study engine expressions helpers for `hasLinkingCode`, `getLinkingCode`,`setLinkingCode` and `deleteLinkingCode`

## 1.6.8 - 2024-09-16

## Changed

- add study expr helper `getLastSubmissionDate` and `getLastSubmissionDateForIncomingState` (for merge version)

## 1.6.7 - 2024-05-11

## Changed

- add study expr helpers for event payload `hasEventPayload`, `hasEventPayloadKey`, `getEventPayloadValueAsStr`, `getEventPayloadValueAsNum`, `hasEventPayloadKeyWithValue`

## 1.6.6 - 2024-05-11

## Changed

- add even type "custom" and `checkEventKey`

## 1.6.5 - 2024-01-31

### Changed

- fix `hasStudyStatus` generator in study engine expressions [issue #5](https://github.com/case-framework/case-editor-tools/issues/5)

## 1.6.4 - 2023-09-20

- new study engine expressions:
  - `getTsForNextISOWeek`
  - `getISOWeekForTs`

## 1.6.2/3 - 2023-09-09

### Changed

- When generating formatted text, also expressions can be used for dynamic content.

## 1.6.1 - 2023-03-21

### Added

- new study engine expression for `generateRandomNumber`

## 1.6.0 - 2023-03-15

### Changed

- Expose SingleChoiceOptionTypes.dateInput to be generate option component for single choice questions
- add the possibility to specify study rules for the event `LEAVE` which is triggered, e.g., when the user deletes the account or a single profile.
- in study rules, where external services are referenced, an optional route can be specified

## 1.5.0 - 2023-02-08

### Added

- new study engine expression for `parseValueAsNum`

## 1.4.1 - 2023-01-31

### Changed

- expressionGenerator additional check to ensure argument is of type "Expression"

## 1.4.0 - 2023-01-27

### Changed

- additional option for survey availability
- PR2: more interfaces exposed

## 1.3.0 - 2022-10-21

### BREAKING CHANGES

- updated survey model from survey-engine related to improvements, how survey versions are represented.
- change how survey export files are generated, in pair with related updates for the python-tools

## 1.2.2

### Changed

- Fix issue for generating custom validations in responsive matrix

## 1.2.1

### Added

- Generator for new question type: "responsive matrix".
