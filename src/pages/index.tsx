import { useTheme } from "next-themes";
import { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { IoAdd } from "react-icons/io5";
import { MdDoneOutline } from "react-icons/md";
import { SlCalculator } from "react-icons/sl";
import { TiDelete, TiDeleteOutline, TiTick } from "react-icons/ti";

import { newProgressModalAtom } from "@/atom/newProgressModalAtom";
import { Chapter, ImportJSONModal, StoreButton } from "@/component/storeButton";
import { toast } from "react-hot-toast";
import { useRecoilState } from "recoil";

import { useLocalStore } from "@/hooks/useLocalStore";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  pname: string;
  description: string;
};

const MiniCalculator = () => {
  const [numberA, setNumberA] = useState(0);
  const [numberB, setNumberB] = useState(0);
  const [symbol, setSymbol] = useState("+");
  const [showState, setShowState] = useState(false);

  let result;
  switch (symbol) {
    case "+":
      result = numberA + numberB;
      break;
    case "-":
      result = numberA - numberB;
      break;
    case "*":
      result = numberA * numberB;
      break;
    case "/":
      result = (numberA / numberB).toFixed(2);
      break;

    default:
      break;
  }

  return (
    <>
      {!showState && (
        <div
          className="text-slate-300 hover:text-slate-600 text-2xl hover:bg-slate-100 dark:hover:bg-slate-300 px-2 py-1 rounded-md my-4 opacity-10 hover:opacity-100"
          onClick={() => setShowState(true)}
        >
          <SlCalculator />
        </div>
      )}
      {showState && (
        <div className="flex align-middle justify-center my-4">
          <input
            type="number"
            value={numberA}
            onChange={(e) => setNumberA(Number(e.target.value))}
            className="block max-w-lg w-14 p-1 text-gray-900 border border-gray-300 rounded-lg bg-transparent text-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="text-slate-900 text-2xl rounded-lg p-1 border-none dark:placeholder-gray-400 dark:bg-gray-800 dark:text-slate-100 bg-transparent ring-transparent font-serif"
          >
            <option value="+"> {"➕"}</option>
            <option value="-"> {"➖"} </option>
            <option value="*"> {"✖️"} </option>
            <option value="/"> {"➗"} </option>
          </select>
          <input
            type="number"
            value={numberB}
            onChange={(e) => setNumberB(Number(e.target.value))}
            className="block max-w-lg w-14 p-1 text-gray-900 border border-gray-300 rounded-lg bg-transparent text-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="block min-w-fit w-14 p-1 ml-2 text-gray-900 text-lg dark:placeholder-gray-400 dark:text-white">
            <span> 🟰 </span>
            <span className="font-bold ml-1">
              {typeof result !== "undefined" ? result : 0}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

const ProgressFormModal = () => {
  const [modalState, setModalState] = useRecoilState(newProgressModalAtom);
  const { addProgressItem } = useLocalStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addProgressItem({
      name: data.pname,
      desc: data.description || "",
      id: `p${Date.now()}`,
      chapters: [],
    });
    setModalState({ open: false });
  };

  // console.log(watch("pname"));

  return (
    <>
      {modalState.open ? (
        <div
          id="new-progress-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 left-0 md:top-auto md:left-[calc(50%-10rem)] z-50 w-auto md:w-[30rem] p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Create New Progress
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="small-modal"
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
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label
                      htmlFor="pname"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      {...register("pname", { required: true })}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="New Progress Item Name"
                    />
                  </div>
                  {/* errors will return when field validation fails  */}
                  {errors.pname && <span>This field is required</span>}
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      {...register("description")}
                      placeholder="About this new item..."
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const ProgressList = () => {
  const { currentProgress, progressList, switchProject, deleteProgressItem } =
    useLocalStore();
  // console.log("ProgressList", currentProgress.name, progressList);

  const handleDeleteItem = () => {
    const confirm = window.confirm(`Delete ${currentProgress.name} progress?`);
    if (confirm) {
      deleteProgressItem(currentProgress.id);
    }
  };
  return (
    <>
      {progressList && (
        <div className="flex items-center w-full justify-between">
          <div className="mr-2 ">
            <select
              id="progressList"
              className=" text-slate-900 text-xl rounded-lg p-1 border-none dark:placeholder-gray-400 dark:bg-gray-800 dark:text-slate-100 bg-transparent ring-transparent font-serif"
              onChange={(event) => {
                switchProject(event.target.value);
              }}
              value={currentProgress.id}
            >
              {progressList.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="text-2xl" onClick={handleDeleteItem}>
            <TiDelete />
          </div>
        </div>
      )}
    </>
  );
};

const ChapterItem = ({
  item,
  handleCheck,
  handleDelete,
  handleChapterUpdate,
}: {
  item: Chapter;
  handleCheck: (id: string) => void;
  handleDelete: (id: string) => void;
  handleChapterUpdate: (newItem: Chapter) => void;
}) => {
  const [nameEditState, setNameEditState] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleInputOnBlur = () => {
    // switch back to text
    setNameEditState(false);
    // update item
    if (item.name === newName) return;
    const newItem = {
      ...item,
      name: newName,
    };
    handleChapterUpdate(newItem);
  };

  return (
    <div>
      <>
        {nameEditState ? (
          <div className="flex justify-center items-center">
            <input
              className="ml-2 pl-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleInputOnBlur}
            />
            <span
              className="mx-2 text-xl text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-300"
              onClick={(e) => {
                e.stopPropagation();
                handleInputOnBlur();
              }}
            >
              <MdDoneOutline />
            </span>
          </div>
        ) : (
          <>
            <input
              className="hidden"
              type="checkbox"
              id={item.id}
              checked={item.checked}
              onChange={() => handleCheck(item.id)}
            />
            <label
              className="flex items-center h-10 px-2 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-500"
              htmlFor={item.id}
            >
              <span className="flex items-center justify-center w-5 h-5 text-transparent border-2 border-slate-300 rounded-full">
                <TiTick />
              </span>
              <span
                className="ml-4 mr-2 text-sm flex-grow"
                onClick={(e) => {
                  e.stopPropagation();
                  setNameEditState(true);
                }}
              >
                {item.name}
              </span>
              <span
                className="text-xl text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                <TiDeleteOutline />
              </span>
            </label>
          </>
        )}
      </>
    </div>
  );
};

const NewChapter = ({
  addNewChapter,
}: {
  addNewChapter: (c: Chapter) => void;
}) => {
  const [onWrite, setOnWrite] = useState(false);
  const [newChapter, setNewChapter] = useState("");
  const [newValue, setNewValue] = useState(10);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!newChapter && newValue > 0) {
        toast.error("input invalid");
        return;
      }

      addNewChapter({
        id: `c${Date.now()}`,
        name: newChapter,
        checked: false,
        val: newValue,
      } as Chapter);

      setNewChapter("");
      setNewValue(10);
      setOnWrite(false);
    }
  };

  return (
    <div className="flex mt-3 w-full items-center">
      {!onWrite && (
        <div
          className="text-slate-300 hover:text-slate-600 text-2xl hover:bg-slate-100 dark:hover:bg-slate-400 flex-grow px-2 py-1 rounded-md"
          onClick={() => setOnWrite(true)}
        >
          <IoAdd />
        </div>
      )}
      {onWrite && (
        <div className="flex flex-col w-full">
          <div className="relative w-full mb-2">
            <input
              type="text"
              value={newChapter}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewChapter(e.target.value)}
              id="new-chapter-name"
              placeholder="Chapter / Part Name"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <span className="text-2xl absolute right-2 top-1">
              <FcCancel
                onClick={() => {
                  setNewChapter("");
                  setNewValue(10);
                  setOnWrite(false);
                }}
              />
            </span>
          </div>
          <div className="w-full">
            <input
              type="number"
              value={newValue}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNewValue(Number.parseInt(e.target.value))}
              id="new-chapter-value"
              placeholder="Page Number / Part Amount"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ThemeButton = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() =>
        currentTheme == "dark" ? setTheme("light") : setTheme("dark")
      }
      className="bg-gray-800 dark:bg-gray-50 hover:bg-gray-600 dark:hover:bg-gray-300 transition-all duration-100 text-white dark:text-gray-800 p-2 rounded-lg text-md"
    >
      {currentTheme === "dark" && <BsSunFill />}
      {currentTheme !== "dark" && <BsMoonFill />}
    </button>
  );
};

const getPorgress = (arr: Chapter[]): number => {
  const sum = arr.reduce((prev, curr) => prev + curr.val, 0);
  const finish = arr
    .filter((item) => item.checked)
    .reduce((prev, curr) => prev + curr.val, 0);
  return finish === 0 ? 0 : Math.floor((finish / sum) * 100);
};

export default function Home() {
  const { saveChangeLocal, currentProgress, setCurrentProgress } =
    useLocalStore();

  if (!currentProgress.chapters) {
    return <div>Loading...</div>;
  }

  // calculate progress in component
  const progress = getPorgress(currentProgress.chapters);

  // check a chapter
  const handleCheck = (id: string) => {
    setCurrentProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      }),
    }));
    saveChangeLocal({
      ...currentProgress,
      chapters: currentProgress.chapters.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      }),
    });
  };

  const handleDelete = (id: string) => {
    setCurrentProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((item) => item.id !== id),
    }));
    saveChangeLocal({
      ...currentProgress,
      chapters: currentProgress.chapters.filter((item) => item.id !== id),
    });
  };

  const handleChapterUpdate = (newItem: Chapter) => {
    setCurrentProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.map((item) => {
        if (newItem.id === item.id) {
          return {
            ...item,
            name: newItem.name,
            val: newItem.val,
          };
        }
        return item;
      }),
    }));
    saveChangeLocal({
      ...currentProgress,
      chapters: currentProgress.chapters.map((item) => {
        if (newItem.id === item.id) {
          return {
            ...item,
            name: newItem.name,
            val: newItem.val,
          };
        }
        return item;
      }),
    });
  };

  const addNewChapter = (newChapter: Chapter) => {
    setCurrentProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.concat(newChapter),
    }));
    saveChangeLocal({
      ...currentProgress,
      chapters: currentProgress.chapters.concat(newChapter),
    });
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center pt-24`}
    >
      <Head>
        <title>{`${currentProgress.name} - PROGRESS`}</title>
      </Head>
      <div className="absolute top-0 left-0 p-4">
        <StoreButton />
      </div>
      <div className="absolute top-0 right-0 p-4">
        <ThemeButton />
      </div>

      <div className="flex justify-between mb-3">
        <div className="w-64 min-w-full text-lg font-bold text-blue-700 dark:text-white">
          <ProgressList />
        </div>
      </div>
      <div className="w-72 h-4 bg-gray-200 rounded-full dark:bg-gray-700">
        {progress > 0 && (
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${progress}%` }}
          >{`${progress}%`}</div>
        )}
      </div>

      <div className="flex flex-col mt-5 space-y-3 w-52 min-w-max">
        {currentProgress.chapters.map((item) => (
          <ChapterItem
            key={item.id}
            item={item}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
            handleChapterUpdate={handleChapterUpdate}
          />
        ))}
        <NewChapter addNewChapter={addNewChapter} />
      </div>

      <MiniCalculator />
      <ProgressFormModal />
      <ImportJSONModal />
    </main>
  );
}
