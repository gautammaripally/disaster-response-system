import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AssessmentQuiz = ({
  assessment,
  questions,
  currentQuestionIndex,
  selectedOption,
  submittedAnswer,
  answers,
  score,
  isComplete,
  resultSummary,
  onSelectOption,
  onSubmitAnswer,
  onPreviousQuestion,
  onNextQuestion,
  onRestart,
  onExit
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0
    ? Math.round(((currentQuestionIndex + (isComplete ? 1 : 0)) / questions.length) * 100)
    : 0;

  if (!assessment) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Icon name="ClipboardCheck" size={16} />
              Assessment Complete
            </div>
            <h2 className="mt-4 text-2xl font-bold text-card-foreground">{assessment.title}</h2>
            <p className="mt-2 text-muted-foreground">
              Review your results and restart the assessment whenever you want another attempt.
            </p>
          </div>

          <div className="grid min-w-[220px] grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background p-4 text-center">
              <div className="text-3xl font-bold text-primary">{score}%</div>
              <div className="text-xs text-muted-foreground">Final score</div>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 text-center">
              <div className="text-3xl font-bold text-success">{resultSummary.correctCount}</div>
              <div className="text-xs text-muted-foreground">Correct answers</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-success/20 bg-success/5 p-4">
            <div className="text-lg font-semibold text-success">{resultSummary.correctCount}</div>
            <div className="text-sm text-muted-foreground">Answered correctly</div>
          </div>
          <div className="rounded-xl border border-error/20 bg-error/5 p-4">
            <div className="text-lg font-semibold text-error">{resultSummary.incorrectCount}</div>
            <div className="text-sm text-muted-foreground">Answered incorrectly</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-lg font-semibold text-card-foreground">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Total questions</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {questions.map((question, index) => {
            const answer = answers[index];
            const isCorrect = answer?.isCorrect;

            return (
              <div
                key={question.id}
                className={`rounded-2xl border p-5 ${
                  isCorrect ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Question {index + 1}
                    </div>
                    <h3 className="mt-2 font-semibold text-card-foreground">{question.prompt}</h3>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${isCorrect ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <span className="font-medium text-card-foreground">Your answer:</span>{' '}
                    <span className="text-muted-foreground">{question.options[answer?.selectedOption] || 'Not answered'}</span>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <span className="font-medium text-card-foreground">Correct answer:</span>{' '}
                    <span className="text-muted-foreground">{question.options[question.correctOption]}</span>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3 text-muted-foreground">
                    {question.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onRestart} iconName="RotateCcw" iconPosition="left">
            Retake Assessment
          </Button>
          <Button variant="outline" onClick={onExit} iconName="ArrowLeft" iconPosition="left">
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
      <div className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Icon name={assessment.icon} size={16} />
            {assessment.title}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-card-foreground">{assessment.title}</h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">{assessment.description}</p>
        </div>

        <div className="min-w-[220px] rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-card-foreground">
              Question {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Select an answer, validate it, then continue to the next question.
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="rounded-2xl border border-border bg-background p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Question {currentQuestionIndex + 1}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-card-foreground">{currentQuestion.prompt}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{currentQuestion.context}</p>
        </div>

        <div className="mt-6 space-y-3">
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = selectedOption === optionIndex;
            const isCorrectChoice = submittedAnswer && optionIndex === currentQuestion.correctOption;
            const isIncorrectSelection = submittedAnswer && isSelected && optionIndex !== currentQuestion.correctOption;

            return (
              <button
                key={option}
                type="button"
                disabled={submittedAnswer}
                onClick={() => onSelectOption(optionIndex)}
                className={`
                  w-full rounded-2xl border p-4 text-left transition-all duration-300
                  ${isCorrectChoice ? 'border-success bg-success/10 shadow-soft' : ''}
                  ${isIncorrectSelection ? 'border-error bg-error/10 shadow-soft' : ''}
                  ${!submittedAnswer && isSelected ? 'border-primary bg-primary/10 shadow-soft scale-[1.01]' : ''}
                  ${!submittedAnswer && !isSelected ? 'border-border bg-card hover:border-primary/40 hover:bg-primary/5' : ''}
                  ${submittedAnswer ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold
                    ${isCorrectChoice ? 'bg-success text-success-foreground' : ''}
                    ${isIncorrectSelection ? 'bg-error text-error-foreground' : ''}
                    ${!submittedAnswer && isSelected ? 'bg-primary text-primary-foreground' : ''}
                    ${!submittedAnswer && !isSelected ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {String.fromCharCode(65 + optionIndex)}
                  </div>
                  <span className="text-sm text-card-foreground">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {submittedAnswer && (
          <div className={`mt-6 rounded-2xl border p-4 ${answers[currentQuestionIndex]?.isCorrect ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5'}`}>
            <div className="flex items-start gap-3">
              <Icon
                name={answers[currentQuestionIndex]?.isCorrect ? 'BadgeCheck' : 'CircleAlert'}
                size={18}
                className={answers[currentQuestionIndex]?.isCorrect ? 'text-success' : 'text-error'}
              />
              <div>
                <div className={`font-semibold ${answers[currentQuestionIndex]?.isCorrect ? 'text-success' : 'text-error'}`}>
                  {answers[currentQuestionIndex]?.isCorrect ? 'Correct answer' : 'Not quite right'}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Previous
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row">
          {!submittedAnswer ? (
            <Button onClick={onSubmitAnswer} disabled={selectedOption === null} iconName="CheckCheck" iconPosition="left">
              Check Answer
            </Button>
          ) : (
            <Button onClick={onNextQuestion} iconName={currentQuestionIndex === questions.length - 1 ? 'Flag' : 'ArrowRight'} iconPosition="right">
              {currentQuestionIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            </Button>
          )}

          <Button variant="ghost" onClick={onExit} iconName="X" iconPosition="left">
            Exit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuiz;
