import { FieldError } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any;

type InputFieldProps = {
  label: string;
  type?: string;
  register: GenericData;
  name: string;
  defaultValue?: string | number;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;   // ✅ added
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  placeholder,
  readOnly = false,   // ✅ default false
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        {...register(name, type === "number" ? { valueAsNumber: true } : {})}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full text-black"
        {...inputProps}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}   // ✅ applied here
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
