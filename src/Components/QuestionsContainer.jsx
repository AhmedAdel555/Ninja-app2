import React, { useEffect, useState } from "react";
import { useLesson } from "../Context/LessonContext";
import QuestionItem from "./QuestionItem";
import { getQuestionsForLesson } from "../../firebaseConfig";

export default function QuestionsContainer() {
  const { selectedLesson } = useLesson();
  const [questions, setQuestions] = useState([]);



  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedLesson?.id) {
        const q = await getQuestionsForLesson(selectedLesson.id);
        setQuestions(q);
      } else {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [selectedLesson]);

  const handleQuestionDelete = (questionId) => {
    // Update the local state to remove the deleted question
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  if (!selectedLesson) {
    return null; // don't show anything until a lesson is selected
  }

  return (
    <div
      className={`questions-container bg-gray-700 p-1 rounded m-1 overflow-auto transition-all duration-300 ${
        questions.length > 0 ? "h-[500px]" : "h-fit"
      }`}>
      <p className="text-white text-sm font-bold text-center mb-1">Questions</p>
      <div className="questions-container">
        <table className="w-full text-center text-white">
          <thead className="bg-gray-600">
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Choices</th>
              <th>Correct Answer</th>
              <th>Image</th>
              <th>Save</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody
            className="divide-y divide-gray-600"
            style={{ fontSize: ".8rem" }}>
            {questions.map((q) => (
              <QuestionItem 
                key={q.id} 
                question={q} 
                lessonId={selectedLesson.id}
                levelId={selectedLesson.levelId}
                onDelete={() => handleQuestionDelete(q.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}