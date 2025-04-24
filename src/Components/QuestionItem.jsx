import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function QuestionItem({ question, lessonId, levelId, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({ ...question });

  const handleChange = (e) => {
    setEditedQuestion({
      ...editedQuestion,
      [e.target.name]: e.target.value,
    });
  };

  const handleChoicesChange = (e) => {
    // Split the comma-separated string into an array for the choices
    const choicesArray = e.target.value.split(",").map(choice => choice.trim());
    setEditedQuestion({
      ...editedQuestion,
      choices: choicesArray,
    });
  };

  const handleSave = async () => {
    try {
      const questionRef = doc(
        db,
        `levels/${levelId}/lessons/${lessonId}/questions/${question.id}`
      );
      await updateDoc(questionRef, editedQuestion);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmed) return;

    try {
      const questionRef = doc(
        db,
        `levels/${levelId}/lessons/${lessonId}/questions/${question.id}`
      );
      await deleteDoc(questionRef);
      // Call the onDelete callback to update the parent component
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Error deleting question.");
    }
  };

  return (
    <tr>
      <td>{question.id}</td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="content"
            value={editedQuestion.content}
            onChange={handleChange}
            className="text-black px-1 w-full"
          />
        ) : (
          question.content
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="choices"
            value={editedQuestion.choices.join(", ")}
            onChange={handleChoicesChange}
            className="text-black px-1 w-full"
          />
        ) : (
          question.choices.join(", ")
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="correct_answer"
            value={editedQuestion.correct_answer}
            onChange={handleChange}
            className="text-black px-1 w-full"
          />
        ) : (
          question.correct_answer
        )}
      </td>
      <td>
        {question.image_url ? (
          <img
            src={question.image_url}
            alt="question"
            className="w-5 h-5 object-cover"
          />
        ) : (
          "No image"
        )}
      </td>
      <td>
        {editMode ? (
          <button className="text-blue-400" onClick={handleSave}>
            Save
          </button>
        ) : (
          <span className="text-gray-500">--</span>
        )}
      </td>
      <td>
        <button className="text-yellow-400" onClick={() => setEditMode(true)}>
          Edit
        </button>
      </td>
      <td>
        <button className="text-red-400" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
}