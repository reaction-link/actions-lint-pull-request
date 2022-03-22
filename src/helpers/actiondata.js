const constants = require('./constants');

function data(
  githubEventInput,
  configBotTokenInput,
  configBotLoginInput,
  useGreetingsInput,
  useApprovalLabelsInput,
  useTitleRegexInput,
  useDescriptionRegexInput,
  useTitleRegexFlagInput,
  useDescriptionRegexFlagInput,
  useProblemTitleInput,
  useProblemDescriptionInput,
  useExplanationTitleInput,
  useExplanationDescriptionInput
) {
  return {
    githubEvent: JSON.parse(githubEventInput),
    botRepoToken: configBotTokenInput,
    botLogin: configBotLoginInput,
    greetings: JSON.parse(useGreetingsInput),
    approvalLabels: JSON.parse(useApprovalLabelsInput),
    titleRegex: new RegExp(useTitleRegexInput, useTitleRegexFlagInput),
    descriptionRegex: new RegExp(
      useDescriptionRegexInput,
      useDescriptionRegexFlagInput
    ),
    useProblemTitle: useProblemTitleInput,
    useProblemDescription: useProblemDescriptionInput,
    useExplanationTitle: JSON.parse(useExplanationTitleInput),
    useExplanationDescription: JSON.parse(useExplanationDescriptionInput),
  };
}

function getAction(inputProvider) {
  return data(
    inputProvider.getInput(constants.githubEvent),
    inputProvider.getInput(constants.configBotRepoToken),
    inputProvider.getInput(constants.configBotLogin),
    inputProvider.getInput(constants.useGreetings),
    inputProvider.getInput(constants.useApprovalLabels),
    inputProvider.getInput(constants.useTitleRegex),
    inputProvider.getInput(constants.useDescriptionRegex),
    inputProvider.getInput(constants.useTitleRegexFlag),
    inputProvider.getInput(constants.useDescriptionRegexFlag),
    inputProvider.getInput(constants.useProblemTitle),
    inputProvider.getInput(constants.useProblemDescription),
    inputProvider.getInput(constants.useExplanationTitle),
    inputProvider.getInput(constants.useExplanationDescription)
  );
}

export { getAction };
