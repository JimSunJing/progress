import type { ProgressItem } from "@/component/storeButton";
import { atom } from "recoil";

const defaultCurrentProgress: ProgressItem = {
  name: "untitled",
  id: "default-z",
  chapters: [],
};

export const currentProgressAtom = atom<ProgressItem>({
  key: "currentProgress",
  default: defaultCurrentProgress,
});
