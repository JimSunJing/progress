import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useSetRecoilState } from "recoil";
import { currentProgressAtom } from "@/atom/progressAtom";
import { BsSave, BsTrash } from "react-icons/bs";
import { useLocalStore } from "@/hooks/useLocalStore";

export const StoreButton = () => {
  const setCurrentProgress = useSetRecoilState(currentProgressAtom);
  const { saveChange2Local } = useLocalStore();
  useEffect(() => {
    try {
      const initial = initStore();
      setCurrentProgress(initial[0]);
    } catch (error) {
      <div>Error</div>;
    }
  }, []);

  const clearLocal = () => {
    localStorage.removeItem("storedChapters");
    setCurrentProgress({ name: "null", chapters: [] });
    toast.success("Local Storage Clear!");
  };

  const save2Local = () => {
    saveChange2Local();
    toast.success("Saved!");
  };

  return (
    <div className="text-xl flex">
      <div>
        <BsSave onClick={() => save2Local()} />
      </div>
      <div className="px-2">
        <BsTrash onClick={() => clearLocal()} />
      </div>
    </div>
  );
};

export const Chapter = z.object({
  name: z.string(),
  id: z.string(),
  checked: z.boolean(),
  val: z.number(),
});

export type Chapter = z.infer<typeof Chapter>;

export const ProgressItem = z.object({
  name: z.string(),
  chapters: z.array(Chapter),
});

export type ProgressItem = z.infer<typeof ProgressItem>;

export const StoredProgress = z.array(ProgressItem);

export type StoredProgress = z.infer<typeof StoredProgress>;

const initStore = () => {
  // console.log("storedChapters", localStorage.getItem("storedChapters"));
  if (!window.localStorage) {
    toast.error("browser does not support localStorage");
    throw new Error("Browser not suuport localStorage...");
  }
  if (
    !localStorage.getItem("storedChapters") ||
    localStorage.getItem("storedChapters") === ""
  ) {
    localStorage.setItem("storedChapters", JSON.stringify([testChapter]));
  }
  return StoredProgress.parse(
    JSON.parse(z.string().min(2).parse(localStorage.getItem("storedChapters")))
  );
};

const testChapter: ProgressItem = {
  name: "test",
  chapters: [
    {
      name: "Chapter 1",
      id: "a1aa1",
      checked: true,
      val: 11,
    },
    {
      name: "Chapter 2",
      id: "b2bb2",
      checked: false,
      val: 23,
    },
    {
      name: "Chapter 3",
      id: "c3cc3",
      checked: false,
      val: 45,
    },
  ],
};
