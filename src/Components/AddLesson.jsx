import React, { useState } from "react";
import {
  addLesson,
  addQuestion,
  addVocab,
  advancedLessonsID,
  basicLessonsID,
  intermediateLessonsID,
} from "../../firebaseConfig";

export default function AddLesson() {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonLevel, setLessonLevel] = useState("BASIC");
  const [lessonStatus, setLessonStatus] = useState("DRAFT");

  const [vocab, setVocab] = useState({
    word: "",
    translated_word: "",
    statement_example: "",
    translated_statement_example: "",
    image_url: "",
  });

  const [question, setQuestion] = useState({
    content: "",
    correct_answer: "",
    choices: "",
    image_url: "",
  });

  function handlingAddingLesson() {
    const levelMap = {
      BASIC: basicLessonsID,
      INTERMEDIATE: intermediateLessonsID,
      ADVANCED: advancedLessonsID,
    };
    const selectedLevelId = levelMap[lessonLevel];

    const lessonData = {
      title: lessonTitle,
      status: lessonStatus,
    };
    addLesson(selectedLevelId, lessonData)
      .then((newLessonId) => {
        console.log("Lesson added with ID:", newLessonId);
        const vocabList = [{ ...vocab }];
        const questionList = [
          {
            ...question,
            choices: question.choices.split(",").map((c) => c.trim()),
          },
        ];

        return Promise.all([
          addVocab(selectedLevelId, newLessonId, vocabList),
          addQuestion(selectedLevelId, newLessonId, questionList),
        ]);
      })
      .then(() => {
        alert("Lesson, vocab and question added successfully!");
        setLessonTitle("");
        setLessonLevel("BASIC");
        setLessonStatus("DRAFT");
        setVocab({
          word: "",
          translated_word: "",
          statement_example: "",
          translated_statement_example: "",
          image_url: "",
        });
        setQuestion({
          content: "",
          correct_answer: "",
          choices: "",
          image_url: "",
        });
      })
      .catch((err) => {
        console.error("Error adding lesson:", err);
      });
  }

  return (
    <>
      <div className="bg-gray-700 p-1 rounded m-1">
        <p className="text-white text-sm font-bold">Add Lesson</p>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Lesson Title"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
          />
          <select
            value={lessonLevel}
            onChange={(e) => setLessonLevel(e.target.value)}>
            <option value="BASIC">BASIC</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
        </div>
        <p className="text-white text-sm mt-2 font-bold">Add Vocab</p>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Word"
            value={vocab.word}
            onChange={(e) => setVocab({ ...vocab, word: e.target.value })}
          />
          <input
            type="text"
            placeholder="Translated Word"
            value={vocab.translated_word}
            onChange={(e) =>
              setVocab({ ...vocab, translated_word: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Statement"
            value={vocab.statement_example}
            onChange={(e) =>
              setVocab({ ...vocab, statement_example: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Translated Statement"
            value={vocab.translated_statement_example}
            onChange={(e) =>
              setVocab({
                ...vocab,
                translated_statement_example: e.target.value,
              })
            }
          />
          <input
            type="file"
            value={vocab.image_url}
            onChange={(e) => setVocab({ ...vocab, image_url: e.target.value })}
          />
        </div>
        <p className="text-white text-sm mt-2 font-bold">Add Question</p>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Content"
            value={question.content}
            onChange={(e) =>
              setQuestion({ ...question, content: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Choices (comma separated)"
            value={question.choices}
            onChange={(e) =>
              setQuestion({ ...question, choices: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Correct Answer"
            value={question.correct_answer}
            onChange={(e) =>
              setQuestion({ ...question, correct_answer: e.target.value })
            }
          />
          <input
            type="file"
            value={question.image_url}
            onChange={(e) => setVocab({ ...question, image_url: e.target.value })}
          />
        </div>
        <button
          onClick={handlingAddingLesson}
          className="bg-gray-400 hover:bg-green-600 p-1 mt-1 rounded text-white">
          Add Lesson
        </button>
      </div>
    </>
  );
}
