interface Params {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function Input({ value, onChange, placeholder, required }: Params) {
  return (
    <input
      type="text"
      required={required}
      className="border border-gray-300 rounded p-2"
      placeholder={placeholder || "Enter text here"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

//sample usage
{/* <Input
  onChange={(val: string) => {
    setValue(val);
  }}
  value={value}
  required={false}
  placeholder="Enter text here"
/>; */}
