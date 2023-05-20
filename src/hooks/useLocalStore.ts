import { currentProgressAtom, progressListAtom } from "@/atom/progressAtom";
import {
  ProgressItem,
  ProgressList,
  StoredProgress,
} from "@/component/storeButton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { z } from "zod";

export const useLocalStore = () => {
  const [currentProgress, setCurrentProgress] =
    useRecoilState(currentProgressAtom);
  const [progressList, setProgressList] = useRecoilState(progressListAtom);

  useEffect(() => {
    initStore();
  }, []);

  const deleteProgressItem = (id: string) => {
    try {
      const storedProgress = getStoredProgress();
      const newProgresses = storedProgress.filter((item) => item.id !== id);
      localStorage.setItem("storedChapters", JSON.stringify(newProgresses));
      // reset progress list
      setProgressList(getProgressList(newProgresses));
      // reset current progress
      if (currentProgress.id === id) {
        setCurrentProgress(newProgresses[0]);
        // update current progress atom
        localStorage.setItem("lastProgressId", newProgresses[0].id);
      }
    } catch (error) {
      console.log("deleteProgressItem", error);
    }
  };

  const saveChangeLocal = (updatedState: ProgressItem) => {
    const storedProgress = getStoredProgress();
    let newProgresses: StoredProgress;
    newProgresses = storedProgress.map((item) => {
      if (item.id !== updatedState.id) {
        return item;
      }
      return updatedState;
    });
    localStorage.setItem("storedChapters", JSON.stringify(newProgresses));
  };

  /**
   * extract data from LocalStorage
   * @returns stored Book/Progress data, Chapter[][]
   */
  const getStoredProgress = (): StoredProgress => {
    try {
      if (
        !localStorage.getItem("storedChapters") ||
        localStorage.getItem("storedChapters") === ""
      ) {
        return [];
      }
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

  const getProgressList = (store: StoredProgress): ProgressList => {
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
        localStorage.setItem("storedChapters", JSON.stringify([testDataEn]));
        setCurrentProgress(testDataEn);
        setProgressList(() => getProgressList([testDataEn]));
        return;
      } catch (error) {
        console.error(error);
      }
    }
    // load data from localStore
    const data = getStoredProgress();
    if (data && data.length > 0) {
      setProgressList(() => getProgressList(data));
      const lastProgressId = localStorage.getItem("lastProgressId");
      if (lastProgressId && lastProgressId !== "") {
        try {
          switchProject(lastProgressId);
        } catch (e) {
          setCurrentProgress(data[0]);
          localStorage.setItem("latsProgressId", data[0].id);
        }
      } else {
        setCurrentProgress(data[0]);
      }
    } else {
      setProgressList([]);
    }
  };

  const addProgressItem = (item: ProgressItem) => {
    console.log("addProgressItem", item);
    // add new progress to localstorage
    const storedProgress = getStoredProgress();
    let newProgresses: StoredProgress;
    newProgresses = storedProgress.concat(item);
    localStorage.setItem("storedChapters", JSON.stringify(newProgresses));
    switchProject(item.id);
    // update progress list
    setProgressList(() => getProgressList(newProgresses));
  };

  const switchProject = (id: string) => {
    // find progress of local store id
    const storedProgress = getStoredProgress();
    const selected = storedProgress.find((item) => item.id === id);
    if (!selected) {
      toast.error("Can't find target progress");
      throw new Error("Progress Not Found!");
    }
    setCurrentProgress(selected);
    // update current progress atom
    localStorage.setItem("lastProgressId", id);
  };

  return {
    currentProgress,
    setCurrentProgress,
    saveChangeLocal,
    getStoredProgress,
    progressList,
    addProgressItem,
    switchProject,
    deleteProgressItem,
  };
};

const testDataZh: ProgressItem = {
  name: "存在主义心理治疗",
  id: "testProgress-0",
  desc: "作者：亚隆",
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

const testDataEn: ProgressItem = {
  name: "Siddhartha",
  desc: "A 1922 novel by Hermann Hesse that deals with the spiritual journey of self-discovery of a man named Siddhartha",
  id: "testProgress-1",
  chapters: [
    {
      name: "The Son of the Brahmin",
      id: "a1aa1",
      checked: true,
      val: 9,
    },
    {
      name: "With the Samanas",
      id: "b2bb2",
      checked: true,
      val: 9,
    },
    {
      name: "Gotama",
      id: "c3cc3",
      checked: false,
      val: 9,
    },
    {
      name: "Awakening",
      id: "44sd4",
      checked: false,
      val: 4,
    },
    {
      name: "Kamala",
      id: "c55",
      checked: false,
      val: 14,
    },
    {
      name: "With the Childlike People",
      id: "c66",
      checked: false,
      val: 9,
    },
    {
      name: "Sansara",
      id: "c77",
      checked: false,
      val: 8,
    },
    {
      name: "By the River",
      id: "c88",
      checked: false,
      val: 11,
    },
    {
      name: "The Ferryman",
      id: "c99",
      checked: false,
      val: 12,
    },
    {
      name: "The Son",
      id: "k100",
      checked: false,
      val: 9,
    },
    {
      name: "Om",
      id: "k111",
      checked: false,
      val: 7,
    },
    {
      name: "Govinda",
      id: "k112",
      checked: false,
      val: 10,
    },
  ],
};
