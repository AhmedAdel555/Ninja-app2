import React, { useEffect, useState } from "react";
import { useLesson } from "../Context/LessonContext";
import VocabItem from "./VocabItem";
import { getVocabsForLesson } from "../../firebaseConfig";

export default function VocabsContainer() {
  const { selectedLesson } = useLesson();
  const [vocabs, setVocabs] = useState([]);

  useEffect(() => {
    const fetchVocabs = async () => {
      if (selectedLesson && selectedLesson.id) {
        const data = await getVocabsForLesson(selectedLesson.id);
        setVocabs(data);
      } else {
        setVocabs([]);
      }
    };
    fetchVocabs();
  }, [selectedLesson]);

  const handleVocabDelete = (vocabId) => {
    // Update the local state to remove the deleted vocab
    setVocabs(vocabs.filter((vocab) => vocab.id !== vocabId));
  };

  if (!selectedLesson) {
    return null; // don't show anything until a lesson is selected
  }

  return (
    <>
      <div
        className={`vocab-container bg-gray-700 p-1 rounded m-1 overflow-auto transition-all duration-300 ${
          vocabs.length > 0 ? "h-[500px]" : "h-fit"
        }`}>
        <p className="text-white text-sm font-bold text-center mb-1">Vocabs</p>
        <div className="vocabs-container">
          <table
            className="w-full text-center text-white"
            style={{ fontSize: ".8rem" }}>
            <thead className="bg-gray-600">
              <tr>
                <th>ID</th>
                <th>Word</th>
                <th>Word Translation</th>
                <th>Statement</th>
                <th>Statement Translation</th>
                <th>Image</th>
                <th>Save</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {vocabs.map((vocab) => (
                <VocabItem
                  key={vocab.id}
                  vocab={vocab}
                  lessonId={selectedLesson.id}
                  levelId={selectedLesson.levelId}
                  onDelete={() => handleVocabDelete(vocab.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
