import { currentProgressAtom } from "@/atom/progressAtom";
import { useRecoilState } from "recoil";
import React from "react";
import { StoredProgress } from "@/component/storeButton";
import { z } from "zod";

export const useLocalStore = () => {
  const [currentProgress, setCurrentProgress] =
    useRecoilState(currentProgressAtom);

  const saveChange2Local = () => {
    const storedProgress = StoredProgress.parse(
      JSON.parse(
        z.string().min(2).parse(localStorage.getItem("storedChapters"))
      )
    );
    const newProgresses = storedProgress
      .filter((item) => item.name !== currentProgress.name)
      .concat(currentProgress);
    localStorage.setItem("storedChapters", JSON.stringify(newProgresses));
  };

  return {
    saveChange2Local,
  };
};
