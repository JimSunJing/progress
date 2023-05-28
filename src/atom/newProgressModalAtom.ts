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

type ImportModal = {
  open: boolean;
};

export const importJSONModalAtom = atom<ImportModal>({
  key: "importJSONModal",
  default: {
    open: false,
  },
});
