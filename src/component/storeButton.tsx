import {
  importJSONModalAtom,
  newProgressModalAtom,
} from "@/atom/newProgressModalAtom";
import { useLocalStore } from "@/hooks/useLocalStore";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineFlightTakeoff, MdOutlineFlightLand } from "react-icons/md";
import { useRecoilState, useSetRecoilState } from "recoil";
import { z } from "zod";

export const StoreButton = () => {
  const { getStoredProgressJSON } = useLocalStore();
  const setImportModal = useSetRecoilState(importJSONModalAtom);

  const exportJSON = () => {
    const data = getStoredProgressJSON();
    if (!data) {
      toast.error("NO DATA");
      return;
    }
    // use navigator.clipboard.writeText() to copy the string
    window.navigator.clipboard
      .writeText(data)
      .then(() => {
        // success
        toast.success("data copied to clipboard");
        console.log("String copied to clipboard");
      })
      .catch((err) => {
        // error
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy: ", err);
      });
  };

  const importJSON = () => {
    setImportModal((prev) => ({
      ...prev,
      open: true,
    }));
  };

  return (
    <div className="text-2xl flex">
      <button
        className="cursor-pointer bg-slate-100 px-2"
        onClick={exportJSON}
        aria-label="export"
      >
        <MdOutlineFlightTakeoff />
      </button>
      <button
        className="cursor-pointer bg-slate-100 px-2"
        onClick={importJSON}
        aria-label="import"
      >
        <MdOutlineFlightLand />
      </button>
      <NewProgressModalButton />
    </div>
  );
};

const NewProgressModalButton = () => {
  const setProgressModal = useSetRecoilState(newProgressModalAtom);
  return (
    <div className="mx-2">
      <button
        className="block text-xl text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg px-2 py-0.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setProgressModal((prev) => ({ ...prev, open: true }))}
      >
        +
      </button>
    </div>
  );
};

export const ImportJSONModal = () => {
  const [json, setJson] = useState("");
  const [modalState, setModalState] = useRecoilState(importJSONModalAtom);
  const { importProgress } = useLocalStore();

  const handleSubmit = () => {
    if (!json) return;
    // zod data check
    const check = StoredProgress.safeParse(JSON.parse(json));
    if (!check.success) {
      toast.error("input data is not correct");
      return;
    }
    // import to localstorage
    importProgress(json);
    // notification
    toast.success("import success!");
  };

  return (
    <>
      {modalState.open ? (
        <>
          <div
            id="import-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed top-0 left-0 md:top-auto md:left-[calc(50%-10rem)] z-50 w-auto md:w-[30rem] p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="relative flex w-full items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                    Import Data
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="import-modal"
                    onClick={() =>
                      setModalState((prev) => ({ ...prev, open: false }))
                    }
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="import-data"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Data (JSON)
                    </label>
                    <input
                      type="text"
                      name="import-data"
                      id="import-data"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder='[{name: "", id:"", desc:"", chapters:[...]}]'
                      onChange={(event) => setJson(event.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={handleSubmit}
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
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
