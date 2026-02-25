import { useState, useEffect } from "react";
import "../components/mainContainer.css";
import { questionData } from "../data";
import { TextAreaQuestion } from "./TextAreaQuestion";
import { RadioQuestion } from "./RadioQuestion";
import { useForm } from "react-hook-form";

export const MainContainer = () => {
  const [examData] = useState(questionData);
  const questions = examData.questions;

  // track currently visible question index
  const [currentIndex, setCurrentIndex] = useState(0);
  const { register, handleSubmit, watch } = useForm();

  // questions that have been answered/locked
  const [lockedIds, setLockedIds] = useState<Set<number>>(new Set());

  // store consolidated responses
  const [responses, setResponses] = useState<
    Array<{ question: string; answer: any }>
  >([]);

  // timer (seconds) and finished state
  const [timeLeft, setTimeLeft] = useState(1 * 60 * 60); // 1 hour example
  const [finished, setFinished] = useState(false);

  const goNext = () => {
    // move forward without submission; answers are locked when user submits
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const currentQuestion = questions[currentIndex];

  const onSubmit = (data: any) => {
    // lock current question if answered
    const name = `q${currentQuestion.id}`;
    const val = data[name];
    if (val !== undefined && val !== "") {
      setLockedIds((s) => new Set(s).add(currentQuestion.id));
    }

    // build array of objects containing each question and the user's answer
    const arr = questions.map((q) => ({
      question: q.question,
      answer: data[`q${q.id}`],
    }));
    setResponses(arr);
    console.log("collected responses", arr);

    if (currentIndex === questions.length - 1) {
      // last question submitted -> finish exam
      setFinished(true);
    } else {
      // otherwise advance to next question
      setCurrentIndex((i) => i + 1);
    }
  };

  // countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (finished) {
    return <ThankYou responses={responses} />;
  }

  return (
    <>
      <div className="timer">
        Time: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>

      <form className="main-container" onSubmit={handleSubmit(onSubmit)}>
        <QuestionContainer question={currentQuestion} />
        <AnswerContainer
          question={currentQuestion}
          register={register}
          disabled={lockedIds.has(currentQuestion.id)}
        />
        <div className="debug">
          <small>
            Current answer:{" "}
            {currentQuestion ? watch(`q${currentQuestion.id}`) : ""}
          </small>
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>

      <ButtonComponent
        goPrev={goPrev}
        goNext={goNext}
        currentIndex={currentIndex}
        questionsLength={questions.length}
        disabled={finished || timeLeft <= 0}
      />
    </>
  );
};

interface QProps {
  question: any;
}

interface ThankProps {
  responses: Array<{ question: string; answer: any }>;
}

const ThankYou: React.FC<ThankProps> = ({ responses }) => (
  <div className="thank-you">
    <h2>Thank you for taking the exam!</h2>
    <p>Your responses have been recorded. Here's what you submitted:</p>
    <ul>
      {responses.map((r, idx) => (
        <li key={idx}>
          <strong>{r.question}</strong>: {String(r.answer)}
        </li>
      ))}
    </ul>
  </div>
);

const QuestionContainer = ({ question }: QProps) => {
  if (!question) return null;

  return (
    <div className="question-container">
      <h2 className="question-text">{question.question}</h2>
    </div>
  );
};

interface AProps {
  question: any;
  register?: any;
  disabled?: boolean;
}

const AnswerContainer = ({ question, register, disabled }: AProps) => {
  if (!question) return null;
  const name = `q${question.id}`;

  switch (question.type) {
    case "text":
      // use the form register if available
      return register ? (
        <TextAreaQuestion register={register} name={name} disabled={disabled} />
      ) : (
        <TextAreaQuestion disabled={disabled} />
      );
    case "msq":
      return register ? (
        <RadioQuestion
          options={question.options || []}
          register={register}
          name={name}
          multiple={false}
          disabled={disabled}
        />
      ) : (
        <RadioQuestion
          options={question.options || []}
          multiple={false}
          disabled={disabled}
        />
      );
    default:
      return null;
  }
};

const ButtonComponent = ({
  goPrev,
  goNext,
  currentIndex,
  questionsLength,
  disabled,
}: any) => {
  return (
    <div className="nav-buttons">
      <button
        type="button"
        onClick={goPrev}
        disabled={disabled || currentIndex === 0}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={disabled || currentIndex === questionsLength - 1}
      >
        Next
      </button>
    </div>
  );
};
