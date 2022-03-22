function greetings(greetings, name) {
  const rnd = Math.floor(Math.random() * greetings.length);
  return greetings[rnd].replace('{name}', name);
}

function explainProblems(amount) {
  return [
    'I found',
    amount === 1 ? 'problem' : 'problems',
    'while checking your pull request.',
  ].join(' ');
}

export { greetings, explainProblems };
