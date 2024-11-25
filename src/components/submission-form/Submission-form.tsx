"use client";

import { ButtonText } from "@/components/buttonText";
import { WrapperContainer } from "@/components/wrapperContainer";
import { TimeSlot } from "@/types/time-slot";

import { ResidentRequestService } from "app/services/resident-request-service";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { HeaderStatus } from "./AppointmentHeaderStatus";
import { FormSchemaUserFormData } from "./definitions/types";
import { FormStepOne } from "./steps/FormStepOne";
import { FormStepThree } from "./steps/FormStepThree";
import { FormStepTwo } from "./steps/FormStepTwo";
import { ReviewSubmit } from "./steps/ReviewSubmit";
import { SubmitSuccess } from "./SubmitSuccess";
import { FormStepValidator } from "./utils/form-step-validator/form-step-validator";

const MAX_STEPS = 4;
export function SubmissionForm() {
  const [formData, setFormData] = useState<Partial<FormSchemaUserFormData>>({
    name: "",
    email: "",
    /* eslint-disable @typescript-eslint/no-explicit-any */
    googleAddressData: {} as any,
    appointmentDate: dayjs().add(1, "day").toDate(),
    timeSlot: TimeSlot.Morning,
    areaCode: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    googleAddressData?: string;
    appointmentDate?: string;
    timeSlot?: string;
    areaCode?: string;
    phoneNumber?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);

  const { data: session, status } = useSession();
  const [isBusy, setIsBusy] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();

  const isFinalStep = useMemo(
    () => currentStep === MAX_STEPS - 1,
    [currentStep]
  );
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const submitterButton = (event.nativeEvent as SubmitEvent)
      ?.submitter as HTMLButtonElement;

    if (submitterButton.name === "next" && !isFinalStep) {
      const result = FormStepValidator(currentStep).safeParse(formData);
      if (!result.success) {
        const fieldErrors: {
          email?: string;
          name?: string;
          googleAddressData?: string;
          appointmentDate?: string;
          timeSlot?: string;
          areaCode?: string;
          phoneNumber?: string;
        } = {};

        for (const err of result.error.errors) {
          fieldErrors[err.path[0] as keyof FormSchemaUserFormData] =
            err.message;
        }

        setErrors(fieldErrors);
        return;
      }
      setErrors({});
    }

    navigateStep(submitterButton.name as "next" | "back");
  }

  const getFormComponentByStep = (index: number): JSX.Element => {
    const steps = [
      <FormStepOne
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        key="step1"
      />,
      <FormStepTwo
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        key="step2"
      />,
      <FormStepThree
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        key="step3"
      />,
      <ReviewSubmit formData={formData} key="submit" />,
    ];

    if (index < 0) return steps[0];
    if (index >= steps.length) return steps[steps.length - 1];

    return steps[index];
  };

  const navigateStep = async (direction: "next" | "back") => {
    if (direction === "back") {
      return currentStep === 0 ? undefined : setCurrentStep((prev) => prev - 1);
    }
    if (isFinalStep) {
      await submitResidentRequest();
      setIsSubmitted(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const submitResidentRequest = async () => {
    try {
      setIsBusy(true);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      await ResidentRequestService.create(formData as any);
      setIsBusy(false);
    } catch (error) {
      console.error(error);
      setSubmitError("Failed to submit request.");
      setIsBusy(false);
    }
  };

  // Grab the user's email from the session user
  useEffect(() => {
    if (session?.user?.email) {
      setFormData({ ...formData, email: session.user.email });
    }
  }, [session?.user?.email]);

  if (status === "unauthenticated") {
    router.replace("/signup");
    return null;
  }

  return isSubmitted ? (
    <SubmitSuccess />
  ) : (
    <div className="flex gap-2 flex-col flex-1 justify-center items-center">
      <HeaderStatus currentStage={currentStep} stages={[1, 2, 3, 4]} />
      <form
        onSubmit={handleSubmit}
        className="flex p-6 w-full flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <WrapperContainer>
          {getFormComponentByStep(currentStep)}
        </WrapperContainer>
        {currentStep > 0 && (
          <ButtonText
            text="Back"
            color="Yellow"
            name="back"
            disabled={isBusy}
          />
        )}
        <ButtonText
          text={currentStep === MAX_STEPS - 1 ? "Submit" : "Next"}
          color="Green"
          name="next"
          disabled={isBusy}
        />
      </form>
      {submitError && (
        <p className="text-red-500 text-sm font-lato">{submitError}</p>
      )}
    </div>
  );
}
