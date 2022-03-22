function data(
  githubEventInput,
  configBotTokenInput,
  configBotLoginInput,
  useGreetingsInput,
  useApprovalLabelsInput,
  useTitleRegexInput,
  useDescriptionRegexInput,
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
    titleRegex: new RegExp(useTitleRegexInput, 'g'),
    descriptionRegex: new RegExp(useDescriptionRegexInput, 'g'),
    useProblemTitle: useProblemTitleInput,
    useProblemDescription: useProblemDescriptionInput,
    useExplanationTitle: JSON.parse(useExplanationTitleInput),
    useExplanationDescription: JSON.parse(useExplanationDescriptionInput),
  };
}

export { data };
