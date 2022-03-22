const core = require('@actions/core');
const github = require('@actions/github');
const { getAction } = require('./helpers/actiondata');
const { extract } = require('./helpers/eventdata');
const {
  getCommentId,
  addPRLabels,
  deletePRLabel,
  createIssueComment,
  updateIssueComment,
  deleteIssueComment,
} = require('./helpers/octokit');
const { greetings, explainProblems } = require('./helpers/rules');

function lintPullRequestEvent(actionData, eventData) {
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
    greetings(actionData.greetings, eventData.pullRequestUserLogin),
    explainProblems(problemsFound.length),
    '\n**Problems**:\n',
    ...problemsFound,
    '\n**Rules**:\n',
    ...actionData.useExplanationTitle,
    ...actionData.useExplanationDescription,
  ].join('\n');
}

async function run() {
  try {
    console.log('Starting...');

    const action = getAction(core);

    console.log('Extracting event data...');

    const event = extract(action.githubEvent);

    console.log('Extracted event data:', JSON.stringify(event));

    // Linting PR
    const problemsFound = lintPullRequestEvent(action, event);

    console.log(problemsFound);

    const success = problemsFound.length === 0;

    const octokit = new github.getOctokit(action.botRepoToken);

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
      const body = getBody(action, event, problemsFound);

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
        if (event.pullRequestLabels.includes(label)) {
          await deletePRLabel(octokit, event, label);
        }
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
