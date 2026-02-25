import React from "react";

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  // react-hook-form support
  register?: any;
  name?: string;
  disabled?: boolean;
}

export const TextAreaQuestion: React.FC<TextAreaProps> = ({
  value = "",
  onChange,
  register,
  name,
  disabled,
}) => {
  if (register && name) {
    return <textarea {...register(name)} className="text-answer" rows={4} cols={50} disabled={disabled} />;
  }

  return (
    <textarea
      className="text-answer"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      rows={4}
      cols={50}
      disabled={disabled}
    />
  );
};
