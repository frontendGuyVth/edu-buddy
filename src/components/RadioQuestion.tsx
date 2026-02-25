import React from "react";

interface RadioProps {
  options: string[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
  multiple?: boolean;
  // react-hook-form
  register?: any;
  name?: string;
  disabled?: boolean;
}

export const RadioQuestion: React.FC<RadioProps> = ({
  options,
  selected = [],
  onChange,
  multiple = false,
  register,
  name,
  disabled,
}) => {
  // if we're controlled by react-hook-form, just render inputs with register
  if (register && name) {
    return (
      <div className="radio-question">
        {options.map((opt) => (
          <label key={opt} className="radio-label">
            <input
              type={multiple ? "checkbox" : "radio"}
              value={opt}
              {...register(name)}
              disabled={disabled}
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  const handleChange = (opt: string, checked: boolean) => {
    if (multiple) {
      if (checked) {
        onChange && onChange([...selected, opt]);
      } else {
        onChange && onChange(selected.filter((s) => s !== opt));
      }
    } else {
      onChange && onChange([opt]);
    }
  };

  return (
    <div className="radio-question">
      {options.map((opt) => (
        <label key={opt} className="radio-label">
          <input
            type={multiple ? "checkbox" : "radio"}
            name="mcq"
            value={opt}
            checked={selected.includes(opt)}
            onChange={(e) => handleChange(opt, e.target.checked)}
            disabled={disabled}
          />
          {opt}
        </label>
      ))}
    </div>
  );
};
