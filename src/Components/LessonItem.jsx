import React from "react";

export default function LessonItem({ lesson, level, onEdit, onDelete }) {
  return (
    <>
      <tr>
        <td>{lesson.id}</td>
        <td>{lesson.title}</td>
        <td>{level}</td>
        <td>{lesson.status}</td>
        <td>
          <button className="text-yellow-400" onClick={() => onEdit(lesson)}>
            Edit
          </button>
        </td>
        <td>
          <button className="text-red-400" onClick={() => onDelete(lesson.id)}>
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}
