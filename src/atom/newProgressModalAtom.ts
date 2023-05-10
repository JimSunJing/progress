import { atom } from "recoil";

type ProgressModal = {
  open: boolean;
};

const defaultNewProgressModal: ProgressModal = {
  open: false,
};

export const newProgressModalAtom = atom<ProgressModal>({
  key: "newProgressModal",
  default: defaultNewProgressModal,
});
