const core = require('@actions/core');
const github = require('@actions/github');
const constants = require('./helpers/constants');
const ad = require('./helpers/actiondata');
const ed = require('./helpers/eventdata');
const {
  getCommentId,
  addPRLabels,
  deletePRLabel,
  createIssueComment,
  updateIssueComment,
  deleteIssueComment,
} = require('./helpers/octokit');
const { greetings, explainProblems } = require('./helpers/rules');

function lintEvent(actionData, eventData) {
  const problemsFound = [];

  if (
    !eventData.pullRequestTitle ||
    !actionData.titleRegex.test(eventData.pullRequestTitle)
  ) {
    problemsFound.push(
      actionData.useProblemTitle.replace('{title}', eventData.pullRequestTitle)
    );
  }

  if (
    !eventData.pullRequestBody ||
    !actionData.descriptionRegex.test(eventData.pullRequestBody)
  ) {
    problemsFound.push(
      actionData.useProblemDescription.replace(
        '{body}',
        eventData.pullRequestBody
      )
    );
  }

  return problemsFound;
}

function getBody(actionData, eventData, problemsFound) {
  return [
    greetings(actionData.useGreetings, eventData.pullRequestUserLogin),
    explainProblems(),
    '\n**Problems**:\n',
    ...problemsFound,
    '\n**Rules**:\n',
    actionData.useExplanationTitle,
    actionData.useExplanationDescription,
  ].join('\n');
}

async function run() {
  try {
    console.log('Starting...');

    const action = ad.data(
      core.getInput(constants.githubEvent),
      core.getInput(constants.configBotRepoToken),
      core.getInput(constants.configBotLogin),
      core.getInput(constants.useGreetings),
      core.getInput(constants.useApprovalLabels),
      core.getInput(constants.useTitleRegex),
      core.getInput(constants.useDescriptionRegex),
      core.getInput(constants.useProblemTitle),
      core.getInput(constants.useProblemDescription),
      core.getInput(constants.useExplanationTitle),
      core.getInput(constants.useExplanationDescription)
    );

    console.log('Extracting event data...');

    const event = ed.extract(action.githubEvent);

    console.log('Extracted event data:', JSON.stringify(event));

    // Linting PR
    const problemsFound = lintEvent(action, eventData);
    const success = problemsFound.length === 0;

    const octokit = new github.getOctokit(botToken);

    const commentId =
      event.pullRequestCommentCount > 0
        ? await getCommentId(octokit, event, action)
        : null;

    if (success) {
      if (commentId) {
        console.log('Deleting Comment...', commentId);
        // Remove comment to prevent cluttering the PR
        await deleteIssueComment(octokit, event, commentId);
        console.log('Deleted Comment...');
      }

      console.log('Adding Labels...');
      // Add Labels displaying successful lint
      await addPRLabels(octokit, event, action.approvalLabels);
      console.log('Added Labels...');

      console.log('Ending with Success...');
    } else {
      const body = getBody(action, problemsFound);

      console.log('Formulated body:', body);

      if (commentId) {
        console.log('Updating Comment...', commentId);
        // Update previous comment to prevent cluttering the PR
        await updateIssueComment(octokit, event, body, commentId);
        console.log('Updated Comment...');
      } else {
        console.log('Creating Comment...');
        // Create a comment
        await createIssueComment(octokit, event, body);
        console.log('Created comment...');
      }

      console.log('Removing Labels...');
      // Remove Labels displaying successful lint
      for (const label of action.approvalLabels) {
        console.log('Removing:', label);
        await deletePRLabel(octokit, event, label);
      }
      console.log('Removed Labels...');

      // Fail the action
      console.log('Ending with Failure...');
      core.setFailed('Failed to lint PR title');
      return;
    }
  } catch (error) {
    console.log('Ending with exception...');
    core.setFailed(error.message);
  }
}

run();
