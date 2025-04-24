import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function VocabItem({ vocab, lessonId, levelId, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [editedVocab, setEditedVocab] = useState({ ...vocab });

  const handleChange = (e) => {
    setEditedVocab({
      ...editedVocab,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const vocabRef = doc(
        db,
        `levels/${levelId}/lessons/${lessonId}/vocabulary/${vocab.id}`
      );
      await updateDoc(vocabRef, editedVocab);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update vocab:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vocabulary item?"
    );
    if (!confirmed) return;

    try {
      const vocabRef = doc(
        db,
        `levels/${levelId}/lessons/${lessonId}/vocabulary/${vocab.id}`
      );
      await deleteDoc(vocabRef);
      // Call the onDelete callback to update the parent component
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Failed to delete vocab:", error);
      alert("Error deleting vocabulary item.");
    }
  };

  return (
    <tr className="border-b border-gray-600">
      <td>{vocab.id}</td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="word"
            value={editedVocab.word}
            onChange={handleChange}
            className="text-black px-1"
          />
        ) : (
          vocab.word
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="translated_word"
            value={editedVocab.translated_word}
            onChange={handleChange}
            className="text-black px-1"
          />
        ) : (
          vocab.translated_word
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="statement_example"
            value={editedVocab.statement_example}
            onChange={handleChange}
            className="text-black px-1"
          />
        ) : (
          vocab.statement_example
        )}
      </td>
      <td>
        {editMode ? (
          <input
            type="text"
            name="translated_statement_example"
            value={editedVocab.translated_statement_example}
            onChange={handleChange}
            className="text-black px-1"
          />
        ) : (
          vocab.translated_statement_example
        )}
      </td>
      <td>
        {vocab.image_url ? (
          <img
            src={vocab.image_url}
            alt="vocab"
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