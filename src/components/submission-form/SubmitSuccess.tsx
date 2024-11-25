"use client";
import { ButtonText } from "@/components/buttonText";
import { TextLabel } from "@/components/textLabel";
import { useRouter } from "next/navigation";

export function SubmitSuccess() {
  const router = useRouter();
  return (
    <div className="flex p-6 flex-col gap-4 bg-simmpy-gray-600 rounded-md justify-center items-center lg:mx-[30%]">
      <TextLabel
        text="Thank you for your submission!"
        fontSize="Text-20"
        color="Gray-100"
      />
      <TextLabel
        text="Please note that your appointment time slot is not guaranteed until you receive a confirmation email."
        fontSize="Text-14"
        color="Gray-100"
      />
      <ButtonText
        text="Return to dashboard"
        color="Green"
        onClick={() => router.push("/dashboard")}
      />
    </div>
  );
}
