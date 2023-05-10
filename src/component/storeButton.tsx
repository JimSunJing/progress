import { newProgressModalAtom } from "@/atom/newProgressModalAtom";
import { currentProgressAtom } from "@/atom/progressAtom";
import { useLocalStore } from "@/hooks/useLocalStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsSave, BsTrash } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { z } from "zod";

export const StoreButton = () => {
  const { saveChangeLocal, progressList, deleteCurrent } = useLocalStore();

  const saveLocal = () => {
    saveChangeLocal();
    toast.success("Saved!");
  };

  return (
    <div className="text-xl flex">
      <button
        className="cursor-pointer bg-slate-100 px-2"
        onClick={() => saveLocal()}
      >
        <BsSave />
      </button>
      <NewProgressModalButton />
    </div>
  );
};

const NewProgressModalButton = () => {
  const setProgressModal = useSetRecoilState(newProgressModalAtom);
  return (
    <>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setProgressModal((prev) => ({ ...prev, open: true }))}
      >
        New
      </button>
    </>
  );
};

// zod schema and types

export const Chapter = z.object({
  name: z.string(),
  id: z.string(),
  checked: z.boolean(),
  val: z.number(),
});

export type Chapter = z.infer<typeof Chapter>;

export const ProgressItem = z.object({
  name: z.string(),
  id: z.string(),
  desc: z.string(),
  chapters: z.array(Chapter),
});

export type ProgressItem = z.infer<typeof ProgressItem>;

export const StoredProgress = z.array(ProgressItem);

export type StoredProgress = z.infer<typeof StoredProgress>;

export const ProgressList = z.array(
  z.object({
    name: z.string(),
    id: z.string(),
  })
);

export type ProgressList = z.infer<typeof ProgressList>;
