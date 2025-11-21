const validateAnswer = (userAnswer, pattern) => {
  userAnswer = userAnswer.trim().toLowerCase();
  return new RegExp(pattern, 'i').test(userAnswer);
};

export const validateAllAnswer = (answers, questions) => {
  const res = [];
  let isCorrect;

  for (let answer of answers) {
    const question = questions.find((question) => question.id === answer.id);

    if (answer.type === "text") {
      const pattern = question.pattern;
      isCorrect = validateAnswer(answer.userAnswer, pattern);
    } else if (answer.type === "radio") {
      let correctAnswer = question.correctAnswer.trim().toLowerCase();
      isCorrect = answer.userAnswer.trim().toLowerCase() === correctAnswer;
    }
    res.push({
      id: answer.id,
      userAnswer: answer.userAnswer,
      isCorrect: isCorrect,
    })
  }
  return res;
}