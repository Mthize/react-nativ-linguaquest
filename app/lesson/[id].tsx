import { Redirect, useLocalSearchParams } from "expo-router";

export default function LessonRedirectScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const lessonId = Array.isArray(id) ? id[0] : id;

  if (!lessonId) {
    return <Redirect href="/learn" />;
  }

  return <Redirect href={{ pathname: "/learn", params: { lessonId } }} />;
}
