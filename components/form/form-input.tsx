"use client"
import { Label } from "@radix-ui/react-label";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  id,
  label,
  type,
  placeholder,
  required,
  disabled,
  errors,
  className,
  defaultValue = "",
  onBlur
}, ref) => {

  const { pending } = useFormStatus();


return(
    <div className="space-y-2">
        <div className="space-y-1">
            {
                label?(
                    <div>
                        <Label htmlFor={id}
                        className="text-sm font-semibold text-neutral-700">
                            {label}
                        </Label>
                    </div>
                ): null
            }
            <Input
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref = {ref}
            required= {required}
            name={id}
            id={id}
            placeholder={placeholder}
            type={type}
            disabled ={pending || disabled}
            className={cn("text-sm px-2 py-1 h-7", className)}
             aria-describedby={`${id}-error`}
            />
            <FormErrors
            id ={id}
            errors={errors}
            />
        </div>
    </div>
) });

FormInput.displayName = "FormInput";