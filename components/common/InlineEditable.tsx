import React, { useState, useEffect, useRef } from 'react';

interface InlineEditableProps {
  initialValue: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  // FIX: Added 'h2' to the allowed types for the 'as' prop to fix type errors.
  as?: 'h1' | 'h2' | 'p' | 'span';
}

const InlineEditable: React.FC<InlineEditableProps> = ({
  initialValue,
  onSave,
  className = '',
  inputClassName = '',
  as: Component = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== initialValue) {
      onSave(value.trim());
    } else {
      setValue(initialValue); // Revert if no change or empty
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} ${inputClassName} bg-transparent border-b-2 border-[var(--border-accent)] outline-none`}
      />
    );
  }

  return (
    <Component className={`${className} cursor-pointer`} onClick={() => setIsEditing(true)}>
      {value}
    </Component>
  );
};

export default InlineEditable;