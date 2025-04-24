import AddLesson from "./Components/AddLesson";
import LessonDetails from "./Components/LessonDetails";
import QuestionsContainer from "./Components/QuestionsContainer";
import SearchLesson from "./Components/SearchLesson";
import VocabsContainer from "./Components/VocabsContainer";
import { LessonProvider } from "./Context/LessonContext";

export default function App() {
  return (
    <>
      <LessonProvider>
        <AddLesson />
        <SearchLesson />
        <LessonDetails />
        <VocabsContainer />
        <QuestionsContainer />
      </LessonProvider>
    </>
  );
}
