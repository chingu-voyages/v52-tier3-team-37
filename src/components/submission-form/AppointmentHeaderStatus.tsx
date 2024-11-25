import { TextLabel } from "@/components/textLabel";

interface StageProgressProps {
  stages: number[];
  currentStage: number; // index of the active stage
}

export function HeaderStatus({ stages, currentStage }: StageProgressProps) {
  return (
    <>
      <TextLabel
        text="We need some information to create your request!"
        color="Gray-600"
        fontSize="Text-20"
      />
      <div className="flex flex-col w-full pt-4">
        <TextLabel
          text={`${currentStage + 1} of ${stages.length}`}
          color="Gray-600"
          fontSize="Text-14"
        />
        <div className="grid grid-flow-col w-full items-center space-x-4">
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center">
              <div
                className={`h-1.5 w-full rounded-full flex items-center justify-center ${
                  index <= currentStage
                    ? "bg-simmpy-gray-100"
                    : "bg-simmpy-gray-600"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
