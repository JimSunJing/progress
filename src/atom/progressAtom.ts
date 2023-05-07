import type { ProgressItem } from "@/component/storeButton";
import { atom } from "recoil";

export const currentProgressAtom = atom<ProgressItem>({
  key: "currentProgress",
  default: {
    name: "default",
    id: "default-z",
    chapters: [],
  },
});