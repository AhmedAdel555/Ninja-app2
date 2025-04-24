import React, { createContext, useContext, useState } from "react";
const LessonContext = createContext();
export function LessonProvider({ children }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <LessonContext.Provider value={{ selectedLesson, selectLesson }}>
      {children}
    </LessonContext.Provider>
  );
}
export const useLesson = () => useContext(LessonContext);
