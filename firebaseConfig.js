import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";

export const basicLessonsID = 'FsJrCVNOxFBcOYRigt2X';
export const intermediateLessonsID = 'ZcgxPOIlIWxYqidpCMyB';
export const advancedLessonsID = 'igIfRF8vzkSEadAWXTUG';

const firebaseConfig = {
  apiKey: "AIzaSyADWQpJpGVDZLJ37eZEan6Z8FxDUfGbuSI",
  authDomain: "voninja-messaging.firebaseapp.com",
  projectId: "voninja-messaging",
  storageBucket: "voninja-messaging.firebasestorage.app",
  messagingSenderId: "910113947104",
  appId: "1:910113947104:web:183c6c133b3ccb38807f85",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export async function getLessons(levelId){
    const snapshot = await getDocs(collection(db, `levels/${levelId}/lessons`));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return data;
}
export const vocabularyList = [
  {
    word: "Pen",
    translated_word: "قلم",
    statement_example: "He has a pen.",
    translated_statement_example: "لديه قلم.",
    image_url: "https://example.com/pen.jpg"
  }
];
export const questionsList = [
  {
    content: "What is 'Pen' in Arabic?",
    correct_answer: "قلم",
    choices: ["قلم", "ورقة", "كتاب", "تفاحة"],
    image_url: "https://example.com/pen-question.jpg"
  }
];


export async function addLesson(levelId, lessonData) {
  const lessonsRef = collection(db, `levels/${levelId}/lessons`);
  const docRef = await addDoc(lessonsRef, { ...lessonData });
  await setDoc(docRef, { id: docRef.id, ...lessonData });
  console.log("Lesson created with ID inside data:", docRef.id);
  return docRef.id;
}

export async function addVocab(levelId, lessonId, vocabList) {
  for (const vocab of vocabList) {
    const docRef = await addDoc(
      collection(db, `levels/${levelId}/lessons/${lessonId}/vocabulary`),
      vocab
    );
    await setDoc(docRef, { id: docRef.id, ...vocab });
  }
  console.log("Vocab added with IDs");
}



export async function addQuestion(levelId, lessonId, questionList) {
  for (const question of questionList) {
    const docRef = await addDoc(
      collection(db, `levels/${levelId}/lessons/${lessonId}/questions`),
      question
    );
    await setDoc(docRef, { id: docRef.id, ...question });
  }
  console.log("Questions added with IDs");
}


export async function searchLessonById(id) {
  const levelIds = [basicLessonsID, intermediateLessonsID, advancedLessonsID];

  for (const levelId of levelIds) {
    const lessonRef = doc(db, `levels/${levelId}/lessons/${id}`);
    const lessonSnap = await getDoc(lessonRef);

    if (lessonSnap.exists()) {
      return { levelId, lessonId: id, ...lessonSnap.data() };
    }
  }

  return null; // not found
}


export async function searchLessonByTitle(title) {
  const levelIds = [basicLessonsID, intermediateLessonsID, advancedLessonsID];
  const lowerTitle = title.trim().toLowerCase();

  for (const levelId of levelIds) {
    const lessonsRef = collection(db, `levels/${levelId}/lessons`);
    const snapshot = await getDocs(lessonsRef);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.title && data.title.toLowerCase() === lowerTitle) {
        return { levelId, lessonId: docSnap.id, ...data };
      }
    }
  }


  return null; // not found
}

const allLevelIds = [basicLessonsID, intermediateLessonsID, advancedLessonsID];
export async function deleteLessonById(lessonId) {
  for (const levelId of allLevelIds) {
    const lessonRef = doc(db, `levels/${levelId}/lessons/${lessonId}`);
    const docSnap = await getDoc(lessonRef);

    if (docSnap.exists()) {
      await deleteDoc(lessonRef);
      console.log(`Lesson ${lessonId} deleted from level ${levelId}`);
      return true;
    }
  }

  console.warn(`Lesson ${lessonId} not found in any level.`);
  return false;
}

export async function getVocabsForLesson(lessonId) {
  const levelIds = [basicLessonsID, intermediateLessonsID, advancedLessonsID];
  
  // Iterate through each level and search for the lesson in its "lessons" subcollection
  for (const levelId of levelIds) {
    const lessonsRef = collection(db, `levels/${levelId}/lessons`);
    const snapshot = await getDocs(lessonsRef);

    // Look for the lesson with the matching lessonId
    for (const docSnap of snapshot.docs) {
      if (docSnap.id === lessonId) {
        // Once the lesson is found, retrieve its "vocabs" subcollection
        const vocabsRef = collection(docSnap.ref, "vocabulary");
        const vocabsSnapshot = await getDocs(vocabsRef);
        
        // If there are vocabs in the collection, return them
        if (!vocabsSnapshot.empty) {
          return vocabsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      }
    }
  }

  // Return empty array if no vocabs found or lessonId does not exist in the specified levels
  return [];
}

export async function getQuestionsForLesson(lessonId) {
  const levelIds = [basicLessonsID, intermediateLessonsID, advancedLessonsID];

  // Iterate through each level and search for the lesson in its "lessons" subcollection
  for (const levelId of levelIds) {
    const lessonsRef = collection(db, `levels/${levelId}/lessons`);
    const snapshot = await getDocs(lessonsRef);

    // Look for the lesson with the matching lessonId
    for (const docSnap of snapshot.docs) {
      if (docSnap.id === lessonId) {
        // Once the lesson is found, retrieve its "questions" subcollection
        const questionsRef = collection(docSnap.ref, "questions");
        const questionsSnapshot = await getDocs(questionsRef);
        
        // If there are questions in the collection, return them
        if (!questionsSnapshot.empty) {
          return questionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
      }
    }
  }

  // Return empty array if no questions found or lessonId does not exist in the specified levels
  return [];
}
