'use client';

import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';
import { Check } from 'lucide-react';

interface Option {
  id: string | number;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  label?: string;
}

export function RadioGroup({ options, value, onChange, label }: RadioGroupProps) {
  return (
    <HeadlessRadioGroup value={value} onChange={onChange}>
      {label && (
        <HeadlessRadioGroup.Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </HeadlessRadioGroup.Label>
      )}
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <HeadlessRadioGroup.Option
            key={option.id}
            value={option}
            className={({ checked }) =>
              `relative flex cursor-pointer rounded-lg px-5 py-4 border ${
                checked
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  : 'border-gray-300 dark:border-gray-700'
              }`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <HeadlessRadioGroup.Label
                        as="p"
                        className={`font-medium ${
                          checked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        {option.label}
                      </HeadlessRadioGroup.Label>
                      {option.description && (
                        <HeadlessRadioGroup.Description
                          as="span"
                          className="inline text-gray-500 dark:text-gray-400"
                        >
                          {option.description}
                        </HeadlessRadioGroup.Description>
                      )}
                    </div>
                  </div>
                  {checked && (
                    <div className="shrink-0 text-blue-600 dark:text-blue-400">
                      <Check className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </>
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
}