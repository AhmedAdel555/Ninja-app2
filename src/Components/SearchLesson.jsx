import React, { useState } from "react";
import {
  advancedLessonsID,
  basicLessonsID,
  deleteLessonById,
  getLessons,
  intermediateLessonsID,
  searchLessonById,
  searchLessonByTitle,
} from "../../firebaseConfig";
import LessonItem from "./LessonItem";
import { useLesson } from "../Context/LessonContext";

export default function SearchLesson() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLevel, setSearchLevel] = useState("BASIC");
  const [searchedLessons, setSearchedLessons] = useState([]);
  const { selectLesson } = useLesson();

  async function handleLiveSearch(value) {
    const query = value.trim();
    if (query === "") {
      setSearchedLessons([]); // clear on empty input
      return;
    }

    const lessonById = await searchLessonById(query);
    if (lessonById) {
      setSearchedLessons([lessonById]);
      return;
    }

    const lessonByTitle = await searchLessonByTitle(query);
    if (lessonByTitle) {
      setSearchedLessons([lessonByTitle]);
      return;
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );
    if (!confirmed) return;

    const deleted = await deleteLessonById(id);
    if (deleted) {
      setSearchedLessons((prev) => prev.filter((lesson) => lesson.id !== id));
    } else {
      alert("Lesson not found or already deleted.");
    }
  }

  async function handleLevelApply() {
    const levelId = getLevelId(searchLevel);
    const allLessons = await getLessons(levelId);
    setSearchedLessons(
      allLessons.map((lesson) => ({
        ...lesson,
        levelId, // ensure levelId is included for editing context
      }))
    );
  }

  function getLevelId(levelName) {
    switch (levelName) {
      case "BASIC":
        return basicLessonsID;
      case "INTERMEDIATE":
        return intermediateLessonsID;
      case "ADVANCED":
        return advancedLessonsID;
      default:
        return basicLessonsID;
    }
  }

  return (
    <>
      <div className="bg-gray-700 p-1 rounded m-1">
        <div className="flex gap-1 justify-center">
          <input
            type="search"
            placeholder="Search by title or id"
            className="w-[300px]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleLiveSearch(e.target.value);
            }}
          />

          <select
            value={searchLevel}
            onChange={(e) => setSearchLevel(e.target.value)}>
            <option value="BASIC">BASIC</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
          <button
            onClick={handleLevelApply}
            className="bg-gray-400 hover:bg-green-600 px-2 py-1 rounded text-white">
            Apply
          </button>
        </div>
        <div
          className={`searched-lessons-container overflow-auto transition-all duration-300 ${
            searchedLessons.length > 0 ? "h-[500px]" : "h-fit"
          }`}>
          <table className="w-full text-white text-center mt-1">
            <thead className="bg-gray-600">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Level</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {searchedLessons.map((lesson, index) => (
                <LessonItem
                  key={index}
                  lesson={lesson}
                  level={searchLevel}
                  onEdit={() => {
                    selectLesson(lesson); // lesson now includes levelId
                    setSearchedLessons([]);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
