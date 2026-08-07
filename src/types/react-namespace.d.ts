import type { ChangeEvent as ReactChangeEvent, FormEvent as ReactFormEvent } from 'react';

declare global {
  namespace React {
    type FormEvent<T = Element> = ReactFormEvent<T>;
    type ChangeEvent<T = Element> = ReactChangeEvent<T>;
  }
}

export {};
