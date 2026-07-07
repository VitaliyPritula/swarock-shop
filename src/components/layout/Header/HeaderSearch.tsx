'use client';

import { Search } from 'lucide-react';
import type { RefObject } from 'react';

type HeaderSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  inputRef?: RefObject<HTMLInputElement | null>;
  placeholder: string;
  buttonLabel: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
};

export default function HeaderSearch({
  value,
  onChange,
  onSearch,
  inputRef,
  placeholder,
  buttonLabel,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  iconClassName = '',
}: HeaderSearchProps) {
  return (
    <div className={className}>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSearch();
          }
        }}
        className={inputClassName}
        placeholder={placeholder}
      />

      <button type="button" onClick={onSearch} className={buttonClassName} aria-label={buttonLabel}>
        <Search className={iconClassName} />
      </button>
    </div>
  );
}
