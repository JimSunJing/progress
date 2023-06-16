import { ProgressItem, ProgressList } from "@/component/storeButton";
import { atom } from "recoil";

const defaultCurrentProgress: ProgressItem = {
  name: "💫",
  id: "default-z",
  desc: "default",
  chapters: [],
};

export const currentProgressAtom = atom<ProgressItem>({
  key: "currentProgress",
  default: defaultCurrentProgress,
});

export const progressListAtom = atom<ProgressList>({
  key: "progressList",
  default: [],
});
