import { useTheme } from "next-themes";
import { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { IoAdd } from "react-icons/io5";
import { TiDeleteOutline, TiTick } from "react-icons/ti";

import { currentProgressAtom } from "@/atom/progressAtom";
import { Chapter, StoreButton } from "@/component/storeButton";
import { useRecoilState } from "recoil";
import { toast } from "react-hot-toast";

const ChapterItem = ({
  item,
  handleCheck,
  handleDelete,
}: {
  item: Chapter;
  handleCheck: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <div>
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
        <span className="ml-4 text-sm flex-grow">{item.name}</span>
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
    <div className="flex mt-3 w-full">
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
      className="bg-gray-800 dark:bg-gray-50 hover:bg-gray-600 dark:hover:bg-gray-300 transition-all duration-100 text-white dark:text-gray-800 px-2 py-2 rounded-lg text-md"
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
  const [currentProgress, setCurrentProgress] =
    useRecoilState(currentProgressAtom);

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
  };

  const handleDelete = (id: string) => {
    setCurrentProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((item) => item.id !== id),
    }));
  };

  const addNewChapter = (newChapter: Chapter) => {
    setCurrentProgress((prev) => ({
      ...prev,
      chapters: prev.chapters.concat(newChapter),
    }));
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center pt-24`}
    >
      <div className="absolute top-0 left-0 p-4">
        <StoreButton />
      </div>
      <div className="absolute top-0 right-0 p-4">
        <ThemeButton />
      </div>

      <div className="w-52 text-end text-slate-300 text-sm">{`${progress}%`}</div>
      <div className="bg-gray-300 dark:bg-gray-400 rounded-full w-52 h-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-4"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-col mt-5 space-y-3 w-52">
        {currentProgress.chapters.map((item) => (
          <ChapterItem
            key={item.id}
            item={item}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        ))}
        <NewChapter addNewChapter={addNewChapter} />
      </div>
    </main>
  );
}
