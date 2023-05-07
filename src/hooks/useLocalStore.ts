import { currentProgressAtom } from "@/atom/progressAtom";
import { useRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import {
  ProgressItem,
  ProgressList,
  StoredProgress,
} from "@/component/storeButton";
import { z } from "zod";
import toast from "react-hot-toast";

export const useLocalStore = () => {
  const [currentProgress, setCurrentProgress] =
    useRecoilState(currentProgressAtom);
  const [progressList, setProgressList] = useState<ProgressList>();

  useEffect(() => {
    initStore();
  }, []);

  useEffect(() => {
    saveChangeLocal();
  }, [currentProgress]);

  const saveChangeLocal = () => {
    const storedProgress = getStoredProgress();
    const newProgresses = storedProgress
      .filter((item) => item.id !== currentProgress.id)
      .concat(currentProgress);
    localStorage.setItem("storedChapters", JSON.stringify(newProgresses));
  };

  /**
   * extract data from LocalStorage
   * @returns stored Book/Progress data, Chapter[][]
   */
  const getStoredProgress = (): StoredProgress => {
    try {
      return StoredProgress.parse(
        JSON.parse(
          z.string().min(2).parse(localStorage.getItem("storedChapters"))
        )
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getProgressList = (): ProgressList => {
    const store = getStoredProgress();
    // get list of all book/progress
    if (store) {
      return store.map((item) => ({
        name: item.name,
        id: item.id,
      }));
    } else return [];
  };

  const initStore = () => {
    // console.log("storedChapters", localStorage.getItem("storedChapters"));
    if (!window.localStorage) {
      toast.error("browser does not support localStorage");
      throw new Error("Browser not support localStorage...");
    }
    // first time opening, load default data
    if (
      !localStorage.getItem("storedChapters") ||
      localStorage.getItem("storedChapters") === ""
    ) {
      try {
        localStorage.setItem("storedChapters", JSON.stringify([testData]));
      } catch (error) {
        console.error(error);
      }
    }
    // load data from localStore
    const data = getStoredProgress();
    if (data.length > 0) {
      setCurrentProgress(data[0]);
      setProgressList(getProgressList());
    }
  };

  return {
    saveChangeLocal,
    getStoredProgress,
    progressList,
  };
};

const testData: ProgressItem = {
  name: "test",
  id: "testProgress-0",
  chapters: [
    {
      name: "第一章 导论",
      id: "a1aa1",
      checked: true,
      val: 31,
    },
    {
      name: "第二章 生命、死亡与焦虑",
      id: "b2bb2",
      checked: true,
      val: 49,
    },
    {
      name: "第三章 儿童的死亡概念",
      id: "c3cc3",
      checked: false,
      val: 38,
    },
    {
      name: "第四章 死亡与心理病理现象",
      id: "44sd4",
      checked: false,
      val: 50,
    },
    {
      name: "第五章 死亡与心理治疗",
      id: "c55",
      checked: false,
      val: 61,
    },
    {
      name: "第六章 责任",
      id: "c66",
      checked: false,
      val: 73,
    },
    {
      name: "第七章 意志",
      id: "c77",
      checked: false,
      val: 69,
    },
    {
      name: "第八章 存在孤独",
      id: "c88",
      checked: false,
      val: 44,
    },
    {
      name: "第九章 存在孤独与心理治疗",
      id: "c99",
      checked: false,
      val: 28,
    },
    {
      name: "第十章 无意义感",
      id: "c100",
      checked: false,
      val: 45,
    },
    {
      name: "第十一章 无意义感与心理治疗",
      id: "c111",
      checked: false,
      val: 24,
    },
  ],
};
