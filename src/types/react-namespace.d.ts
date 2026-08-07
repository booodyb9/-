import type { ChangeEvent as ReactChangeEvent, ComponentType, FormEvent as ReactFormEvent, SVGProps } from 'react';

declare global {
  namespace React {
    type FormEvent<T = Element> = ReactFormEvent<T>;
    type ChangeEvent<T = Element> = ReactChangeEvent<T>;
  }

  const Sparkles: ComponentType<SVGProps<SVGSVGElement>>;
  const Loader2: ComponentType<SVGProps<SVGSVGElement>>;
}

export {};
