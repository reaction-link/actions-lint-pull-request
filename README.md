## Lint your pull requests

### Can...
Prefilter submitted Pull Requests by...
- Check if a PR title matches a regular expression
- Check if a PR description matches a regular expression
- Assign Labels if the PR passes the linting process

### Can not...
- do code review for you


### Example Workflow

```
name: Lint Pull Request
on:
  pull_request:
    types: [opened, edited]

jobs:
  lint-pull-request:
    name: Lint Pull Request
    runs-on: ubuntu-latest

    steps:
      - name: Lint Pull Request
        uses: reaction-link/actions-lint-pull-request@v2
        with:
          triage-pr-token: ${{secrets.OUR_BOT_REPO_SCOPED_TOKEN}} // GITHUB_TOKEN does not work, is required for deleting labels
          config-bot-repotoken: ${{secrets.OUR_BOT_REPO_SCOPED_TOKEN}} // GITHUB_TOKEN also works
          config-bot-login: mybot // login for GITHUB_TOKEN is github-actions[bot]
          github-event: ${{toJson(github.event)}}
```

### Available inputs

```
inputs:
  access-token: /** v2 */
    description: "Token with triage permissions or GITHUB_TOKEN"
    required: true
  token-login: /** v2 */
    description: "Username of the GitHub user"
    required: true
  config-bot-repotoken: /** v1 */
    description: "Token with permissions to comment on a Pull Request (Github Token for example)"
    required: true
  config-bot-login: /** v1 */
    description: "Username of the GitHub user (bot account for example)"
    required: true
  github-event:
    description: "toJSON of github.event (event triggering the action)"
    required: true
  use-greetings:
    description: "JSON string array to use for randomly selected greetings (used in comment body, runs through JSON.parse)"
    default: '["Hello @{name},\n"]'
  use-approval-labels:
    description: "JSON string array to use for labeling linted pull request (runs through JSON.parse)"
    default: '["Good"]'
  use-title-regex:
    description: "Regex string to use for linting the pull request title"
    default: '\w+'
  use-description-regex:
    description: "Regex string to use for linting the pull request description"
    default: '\w+'
  use-title-regex-flag:
    description: "Regex flag to use for linting the pull request title (Use empty string for none)"
    default: 'g'
  use-description-regex-flag:
    description: "Regex flag to use for linting the pull request description (Use empty string for none)"
    default: 'g'
  use-problem-title:
    description: "Template string to use for highlighting a title that failed to pass (used in comment body). Template-Literals: {title}"
    default: '- The title `{title}` is not the format I expected.'
  use-problem-description:
    description: "Template string to use for highlighting a description that failed to pass (used in comment body). Template-Literals: {body}"
    default: '- The description `{body}` is not the format I expected.'
  use-explanation-title:
    description: "JSON string array to describe rules to pass linting for the pull request title (used in comment body, runs through JSON.parse)"
    default: '["- There must be a title","- Use proper capitalization"]'
  use-explanation-description:
    description: "JSON string array to describe rules to pass linting for the pull request description (used in comment body, runs through JSON.parse)"
    default: '["- There must be a description"]'

```

### Additional Setup

- Generate a GitHub PAT for the user you want to act on behalf of (bot account for example). See [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for GitHub documentation. Required scope is "repo". The user must have at least Triage access to the repository
- Add this PAT as Action Secret to the repository or organization
- For Regular Expressions, each `\` must be string escaped
