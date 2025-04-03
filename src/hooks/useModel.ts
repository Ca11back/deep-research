import { useState } from "react";
import { useSettingStore } from "@/store/setting";
import { shuffle } from "radash";

function useModel() {
  const [modelList, setModelList] = useState<string[]>([]);

  async function refresh(): Promise<string[]> {
    const {
      apiKey = "",
      apiProxy,
    } = useSettingStore.getState();
    const apiKeys = shuffle(apiKey.split(","));

    if (apiKey) {
      const response = await fetch(
        `${
          apiProxy || "https://generativelanguage.googleapis.com"
        }/v1beta/models`,
        {
          headers: {
            "x-goog-api-key": apiKeys[0],
          },
        }
      );
      const { models = [] } = await response.json();
      const newModelList = (models as Model[])
        .filter(
          (item) =>
            item.name.startsWith("models/gemini") &&
            item.supportedGenerationMethods.includes("generateContent")
        )
        .map((item) => item.name.replace("models/", ""));
      setModelList(newModelList);
      return newModelList;
    } else {
      const response = await fetch("/api/ai/google/v1beta/models",
        {
          headers: {
            "x-goog-api-key": "",
          },
        });
      const { models = [] } = await response.json();
      const newModelList = (models as Model[])
        .filter(
          (item) =>
            item.name.startsWith("models/gemini") &&
            item.supportedGenerationMethods.includes("generateContent")
        )
        .map((item) => item.name.replace("models/", ""));
      setModelList(newModelList);
      return newModelList;
    }
  }

  return {
    modelList,
    refresh,
  };
}

export default useModel;
