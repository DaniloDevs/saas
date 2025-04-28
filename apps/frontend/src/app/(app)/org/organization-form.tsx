'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState } from "@/hook/useFormState"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertOctagon, Loader2 } from "lucide-react"
import { createOrganizationAction } from "../create-organization/actions"

export function OrganizationForm() {
     const [{ errors, success, message }, handleSubmit, isPeding] = useFormState(
          createOrganizationAction
     )

     return (
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center p-2 "  >
               {success === false && message && (
                    <Alert variant="destructive" className="absolute bottom-5 right-8 w-56">
                         <AlertOctagon className="size-4" />
                         <AlertTitle>Save organization Failed!</AlertTitle>
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
                    <Label htmlFor="name">Name</Label>
                    <Input name='name' id="name" />

                    {errors?.name && (
                         <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.name[0]}</p>
                    )}
               </div>

               <div className="space-y-2 w-full">
                    <Label htmlFor="avatar_url"> Avatar Url</Label>
                    <Input name='avatar_url' type="text" id="avatar_url" inputMode="url" placeholder="https://exemple.com/avatar"/>

                    {errors?.avatar_url && (
                         <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.avatar_url[0]}</p>
                    )}
               </div>

               <div className="space-y-2 w-full">
                    <Label htmlFor="domain"> domain </Label>
                    <Input name='domain' type="text" id="domain" inputMode="url" placeholder="exemple.com" />

                    {errors?.domain && (
                         <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.domain[0]}</p>
                    )}
               </div>

               <div className="space-y-1">
                    <div className="flex items-start space-x-2">
                         <div className="translate-y-0.5">
                              <Checkbox
                                   name="shouldAttachUsersByDomain"
                                   id="shouldAttachUsersByDomain"
                              />
                         </div>
                         <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
                              <span className="text-sm font-medium leading-none">
                                   Auto-join new members
                              </span>
                              <p className="text-sm text-muted-foreground">
                                   This will automatically invite all members with same e-mail
                                   domain to this organization.
                              </p>
                         </label>
                    </div>
               </div >

               <Button type="submit" variant="outline" className="w-full" disabled={isPeding}>
                    {isPeding ? <Loader2 className="size-4 animate-spin" /> : "Save Organization"}
               </Button>
          </form>
     )
}