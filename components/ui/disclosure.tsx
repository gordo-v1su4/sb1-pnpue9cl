'use client';

import { Disclosure as HeadlessDisclosure, Transition } from '@headlessui/react';
import { ChevronUp } from 'lucide-react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export function Disclosure({ title, children }: DisclosureProps) {
  return (
    <HeadlessDisclosure as="div" className="w-full">
      {({ open }) => (
        <>
          <HeadlessDisclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUp
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
            />
          </HeadlessDisclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <HeadlessDisclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 dark:text-gray-400">
              {children}
            </HeadlessDisclosure.Panel>
          </Transition>
        </>
      )}
    </HeadlessDisclosure>
  );
}