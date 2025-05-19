'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hooks/useFormState"
import { createProjectAction } from "./action"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertOctagon, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "next/navigation"
import { queryClient } from "@/lib/react-query"


export function ProjectForm() {
     const { slug: org } = useParams<{ slug: string }>()


     const [{ errors, success, message }, handleSubmit, isPeding] = useFormState(
          createProjectAction,
          () => {
               queryClient.invalidateQueries({
                    queryKey: [org, 'projects'],
               })
          },
     )

     return (
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center p-2 w-86" >
               {success === false && message && (
                    <Alert variant="destructive" className="absolute bottom-5 right-8 w-56">
                         <AlertOctagon className="size-4" />
                         <AlertTitle>Save project Failed!</AlertTitle>
                         <AlertDescription>
                              <p>{message}</p>
                         </AlertDescription>
                    </Alert>
               )}

               {success === true && message && (
                    <Alert variant="success" className="absolute bottom-5 right-8 w-80">
                         <AlertOctagon className="size-4" />
                         <AlertTitle>Success!</AlertTitle>
                         <AlertDescription>
                              <p>{message}</p>
                         </AlertDescription>
                    </Alert>
               )}

               <div className="space-y-2 w-full">
                    <Label htmlFor="name">Project name</Label>
                    <Input name='name' id="name" />

                    {errors?.name && (
                         <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.name[0]}</p>
                    )}
               </div>

               <div className="space-y-2 w-full">
                    <Label htmlFor="description"> Description </Label>
                    <Textarea name='description' id="description" />

                    {errors?.description && (
                         <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.description[0]}</p>
                    )}
               </div>


               <Button type="submit" variant="outline" className="w-full" >
                    {isPeding ? <Loader2 className="size-4 animate-spin" /> : "Save Project"}
               </Button>
          </form>
     )
}