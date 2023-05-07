import { currentProgressAtom } from "@/atom/progressAtom";
import { useLocalStore } from "@/hooks/useLocalStore";
import toast from "react-hot-toast";
import { BsSave, BsTrash } from "react-icons/bs";
import { z } from "zod";

export const StoreButton = () => {
  const { saveChangeLocal, progressList, deleteCurrent } = useLocalStore();

  const saveLocal = () => {
    saveChangeLocal();
    toast.success("Saved!");
  };

  return (
    <div className="text-xl flex">
      <div>
        <BsSave onClick={() => saveLocal()} />
      </div>
      <div className="px-2">
        <BsTrash onClick={() => {}} />
      </div>
    </div>
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
