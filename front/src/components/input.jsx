export const Input = ({error, style,label, type, value, onChange, placeholder }) => {
  return (
    <>
      <div>
      <label htmlFor={label} className="m-2">
        {label}
      </label>
      {error && (
        <span className="text-red-600">{error}</span>
      )}
      <input
        id={label}
        type={type}
        value={value}
        className="bg-gray-50 focus:outline-none border-2
                focus:border-indigo-600 text-gray-900 text-sm rounded-lg block w-full p-2.5
              border-grey-300 placeholder-gray-400 dark:text-white mb-2"
        style={style}
        onChange={onChange}
        placeholder={placeholder}
      />
      </div>
    </>
  );
};
