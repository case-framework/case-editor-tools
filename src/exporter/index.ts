import fs from 'fs';
import { Logger } from "../logger";
import { buildMessageConfig } from '../types/messageConfig';
import { Study } from "../types/study";

export const generateFilesForStudy = (study: Study, pretty?: boolean) => {
  const outputName = study.outputFolderName ? study.outputFolderName : study.studyKey;
  const outputRoot = `./output/${outputName}`;

  Logger.log(`Start generating files for study ${outputName}.`);

  if (!fs.existsSync(outputRoot)) {
    fs.mkdirSync(outputRoot, { recursive: true })
  }

  // Surveys:
  generateSurveyFiles(study, outputRoot, pretty);

  // Study rules:
  generateStudyRuleFile(study, outputRoot, pretty);

  // Custom Study rules: (manually triggered rules)
  generateCustomStudyRules(study, outputRoot, pretty);

  // Message configs:
  generateMessageConfigs(study, outputRoot, pretty);


}

const generateSurveyFiles = (study: Study, outputPath: string, pretty?: boolean) => {
  if (study.surveys.length > 0) {
    Logger.log(`\tSurveys:`);
  } else {
    Logger.log(`\tNo surveys in the study.`)
  }
  const surveyOutPath = `${outputPath}/surveys`;
  if (!fs.existsSync(surveyOutPath)) {
    fs.mkdirSync(surveyOutPath, { recursive: true })
  }
  study.surveys.forEach(survey => {
    const fileName = `${surveyOutPath}/${survey.key}.json`;
    const outputObject = survey.getSurvey();

    try {
      fs.writeFileSync(fileName, JSON.stringify(outputObject, undefined, pretty ? 2 : undefined));
    } catch (err) {
      Logger.error(err);
      return;
    }
    Logger.success(`\t\t${survey.key} saved`);
  })
}

const generateStudyRuleFile = (study: Study, outputPath: string, pretty?: boolean) => {
  if (!study.studyRules) {
    Logger.log(`\tNo study rules in the study.`)
    return;
  } else {
    Logger.log(`\tStudy rule:`)
  }

  const fileName = `${outputPath}/studyRules.json`;
  const outputObject = study.studyRules.get();

  try {
    fs.writeFileSync(fileName, JSON.stringify(outputObject, undefined, pretty ? 2 : undefined));
  } catch (err) {
    Logger.error(err);
    return;
  }

  Logger.success(`\t\tStudy rules saved`);
}

const generateCustomStudyRules = (study: Study, outputPath: string, pretty?: boolean) => {
  if (!study.customStudyRules || study.customStudyRules.length < 0) {
    Logger.log(`\tNo custom study rules in the study.`)
    return;
  } else {
    Logger.log(`\tCustom study rules:`)
  }

  const customRulePath = `${outputPath}/customRules`;
  if (!fs.existsSync(customRulePath)) {
    fs.mkdirSync(customRulePath, { recursive: true })
  }

  study.customStudyRules.forEach(studyRule => {
    const fileName = `${customRulePath}/${studyRule.name}.json`;
    const outputObject = studyRule.rules;

    try {
      fs.writeFileSync(fileName, JSON.stringify(outputObject, undefined, pretty ? 2 : undefined));
    } catch (err) {
      Logger.error(err);
      return;
    }

    Logger.success(`\t\tRule ${studyRule.name} saved`);
  })

}

const generateMessageConfigs = (study: Study, outputPath: string, pretty?: boolean) => {
  if (!study.messageConfigs || study.messageConfigs.length < 1) {
    Logger.log(`\tNo message configs in the study.`)
    return;
  } else {
    Logger.log(`\tMessage configs:`)
  }

  const messageConfigPath = `${outputPath}/messageConfigs`;
  if (!fs.existsSync(messageConfigPath)) {
    fs.mkdirSync(messageConfigPath, { recursive: true })
  }

  study.messageConfigs.forEach(conf => {
    const fileName = `${messageConfigPath}/${conf.label.replace(/ /g, '_').toLocaleLowerCase()}.json`;
    const outputObject = buildMessageConfig(conf, study.studyKey);

    try {
      fs.writeFileSync(fileName, JSON.stringify(outputObject, undefined, pretty ? 2 : undefined));
    } catch (err) {
      Logger.error(err);
      return;
    }

    Logger.success(`\t\tConfig for "${conf.label}" saved`);
  })
}
