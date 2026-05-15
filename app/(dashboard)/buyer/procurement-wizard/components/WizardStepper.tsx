// WizardStepper.tsx

"use client"

import { Check } from "lucide-react"

type Step = {
  id: number
  title: string
}

type Props = {
  currentStep: number
  steps: Step[]
}

export default function WizardStepper({
  currentStep,
  steps,
}: Props) {
  return (
    <div
      className="
        overflow-x-auto
        pb-2
      "
    >
      <div
        className="
          flex
          min-w-max
          items-center
          justify-between
          gap-3
        "
      >
        {steps.map(
          (step, index) => {
            const isActive =
              currentStep ===
              step.id

            const isCompleted =
              currentStep >
              step.id

            return (
              <div
                key={step.id}
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      text-sm
                      font-bold
                      transition-all

                      ${
                        isCompleted
                          ? `
                            border-green-500
                            bg-green-500
                            text-white
                          `
                          : isActive
                            ? `
                              border-primary
                              bg-primary
                              text-white
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-400
                            `
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check
                        className="
                          h-5
                          w-5
                        "
                      />
                    ) : (
                      step.id
                    )}
                  </div>

                  <div>
                    <p
                      className={`
                        text-sm
                        font-semibold

                        ${
                          isActive
                            ? "text-primary"
                            : `
                              text-slate-500
                            `
                        }
                      `}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>

                {index !==
                  steps.length -
                    1 && (
                  <div
                    className="
                      hidden
                      h-[2px]
                      w-14
                      rounded-full
                      bg-slate-200
                      sm:block
                    "
                  />
                )}
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}