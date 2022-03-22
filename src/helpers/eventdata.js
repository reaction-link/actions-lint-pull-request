function extract(githubEvent) {
  const action = githubEvent['action'];

  const pullRequestData = githubEvent['pull_request'];
  const repositoryData = githubEvent['repository'];

  const pullRequestNumber = pullRequestData['number'];
  const pullRequestTitle = pullRequestData['title'];
  const pullRequestBody = pullRequestData['body'];
  const pullRequestCommentCount = pullRequestData['comments'];

  const pullRequestLabels = pullRequestData['labels'];

  const pullRequestUserData = pullRequestData['user'];
  const repositoryOwnerData = repositoryData['owner'];

  const pullRequestUserLogin = pullRequestUserData['login'];
  const repositoryOwnerLogin = repositoryOwnerData['login'];

  const repositoryName = repositoryData['name'];

  return {
    action,
    pullRequestNumber,
    pullRequestTitle,
    pullRequestBody,
    pullRequestCommentCount,
    pullRequestLabels,
    pullRequestUserLogin,
    repositoryOwnerLogin,
    repositoryName,
  };
}

export { extract };
