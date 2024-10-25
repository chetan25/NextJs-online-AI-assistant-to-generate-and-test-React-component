import { useRef } from "react";

const Form = ({ handleClick }: { handleClick: (question: string) => void }) => {
  const questionRef = useRef<HTMLInputElement | null>(null);
  return (
    <form className="max-w-lg mx-auto mb-8 flex gap-4">
      <div className="mb-5">
        <label
          htmlFor="question"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Question
        </label>
        <input
          type="text"
          id="question"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Build a simple todo component"
          required
          ref={questionRef}
        />
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleClick(questionRef.current!.value);
        }}
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-2 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-24 h-16 my-4"
      >
        Submit
      </button>
    </form>
  );
};

export default Form;
