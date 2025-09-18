import { useDrop } from "react-dnd";
import { useRef } from "react";
import { Input } from "@/components/ui/input"; // or wherever your Input comes from

type DragItem = { text: string };

interface DroppableInputProps {
  id: string;
  type: string;
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (val: string) => void;
}

export function DroppableInput({
  id,
  type,
  value,
  placeholder,
  className,
  onChange,
}: DroppableInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [, drop] = useDrop<DragItem>(() => ({
    accept: "TOKEN",
    drop: (item) => {
      const input = inputRef.current;
      if (!input) return;

      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;

      const newValue = value.slice(0, start) + item.text + value.slice(end);
      onChange(newValue);
    },
  }));

  return (
    <Input
      ref={(node) => {
        inputRef.current = node;
        drop(node); // attach drop target
      }}
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
}
