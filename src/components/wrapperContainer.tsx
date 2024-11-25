import type { ReactNode } from "react";

interface WrapperContainerProps {
  children: ReactNode;
}

export function WrapperContainer({ children }: WrapperContainerProps) {
  return <div className="flex flex-col w-full gap-2">{children}</div>;
}
