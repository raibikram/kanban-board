import { useState } from "react";

interface TextInputPopupProps {
  isOpen: boolean;
  title: string;
  initialValue: string;
  placeholder?: string;
  onClose: () => void;
  onSave: (value: string) => void;
}
export default function TextInputPopup({
  initialValue,
  isOpen,
  onClose,
  onSave,
  title,
  placeholder,
}: TextInputPopupProps) {
  const [value, setValue] = useState(initialValue);
  function handleSave() {
    if(!value.trim()) return;
    onSave(value)
    setValue("")
    onClose();
  }
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none w-full"
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition cursor-pointer"
            onClick={onClose}
          >
            Cancle
          </button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
