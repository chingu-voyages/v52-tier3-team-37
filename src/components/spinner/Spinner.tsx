import { Spinner as NextUiSpinner } from "@nextui-org/spinner";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}
export default function Spinner({ size = "md" }: SpinnerProps) {
  return <NextUiSpinner size={size} />;
}
