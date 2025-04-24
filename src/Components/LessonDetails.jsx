import React from "react";
import { useLesson } from "../Context/LessonContext";

export default function LessonDetails() {
  const { selectedLesson } = useLesson();

  if (!selectedLesson) {
    return (
      <div className="bg-gray-700 p-1 rounded m-1 text-white text-center">
        No lesson selected.
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-1 rounded m-1">
      <p className="text-white text-sm font-bold text-center my-1">
        Lesson Details
      </p>
      <div className="lesson-data flex gap-1">
        <input
          type="text"
          placeholder="Lesson ID"
          value={selectedLesson.id}
          readOnly
        />
        <input
          type="text"
          placeholder="Lesson Title"
          value={selectedLesson.title}
          readOnly
        />
        <input
          type="text"
          placeholder="Lesson Status"
          value={selectedLesson.status}
          readOnly
        />
        <button className="bg-blue-400 text-white px-2 py-1 rounded">
          Update
        </button>
        <button className="bg-green-600 text-white px-2 py-1 rounded">
          Publish
        </button>
      </div>
    </div>
  );
}
