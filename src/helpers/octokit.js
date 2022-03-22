async function getCommentId(octokit, eventData, actionData) {
  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: eventData.repositoryOwnerLogin,
      repo: eventData.repositoryName,
      issue_number: eventData.pullRequestNumber,
    }
  );

  // Looking for previous comment
  const comment = response['data'].find((comment) => {
    return comment['user']['login'] === actionData.botLogin;
  });

  return comment && comment['id'];
}

export { getCommentId };

async function addPRLabels(octokit, eventData, labels) {
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/labels',
    {
      owner: eventData.repositoryOwnerLogin,
      repo: eventData.repositoryName,
      issue_number: eventData.pullRequestNumber,
      labels: labels,
    }
  );
}

export { addPRLabels };

async function deletePRLabel(octokit, eventData, label) {
  await octokit.request(
    'DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}',
    {
      owner: eventData.repositoryOwnerLogin,
      repo: eventData.repositoryName,
      issue_number: eventData.pullRequestNumber,
      name: label,
    }
  );
}

export { deletePRLabel };

async function createIssueComment(octokit, eventData, body) {
  await octokit.request(
    'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
    {
      owner: eventData.repositoryOwnerLogin,
      repo: eventData.repositoryName,
      issue_number: eventData.pullRequestNumber,
      body: body,
    }
  );
}

export { createIssueComment };

async function updateIssueComment(octokit, eventData, body, commentId) {
  await octokit.request(
    'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
    {
      owner: eventData.repositoryOwnerLogin,
      repo: eventData.repositoryName,
      comment_id: commentId,
      body: body,
    }
  );
}

export { updateIssueComment };

async function deleteIssueComment(octokit, eventData, commentId) {
  await octokit.request(
    'DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}',
    {
      owner: eventData.repositoryOwnerLogin,
      repo: eventData.repositoryName,
      comment_id: commentId,
    }
  );
}

export { deleteIssueComment };
