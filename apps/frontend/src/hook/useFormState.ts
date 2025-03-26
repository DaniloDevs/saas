
import { useState, useTransition, type FormEvent } from "react"


interface FormState {
     success: Boolean,
     message: string | null,
     errors: Record<string, string[]> | null
}

export function useFormState(
     action: (data: FormData) => Promise<FormState>,
     initialState?: FormState
) {
     const [isPeding, startTransition] = useTransition()

     const [formState, setFormState] = useState(
          initialState ?? {
               success: false,
               message: null,
               errors: null
          }
     )

     async function handleSubmit(event: FormEvent<HTMLFormElement>) {
          event.preventDefault()

          const form = event.currentTarget
          const data = new FormData(form)

          startTransition(async () => {
               const state = await action(data)
               setFormState(state)
          })
     }

     return [formState, handleSubmit, isPeding] as const
}