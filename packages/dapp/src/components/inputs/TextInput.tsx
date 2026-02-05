import { InputHTMLAttributes, FC, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
   'block w-full rounded-md border font-medium focus:outline-none focus:ring-2 focus:ring-offset-1', // Shared styles
   {
      variants: {
         variant: {
            default:
               'border-gray-300 bg-white text-primary-900 focus:ring-primary-600',
            outline:
               'border-gray-300 bg-transparent text-primary-900 focus:ring-primary-600',
            error: 'border-re-500 bg-re-100 text-re-500 focus:ring-re-500',
            success: 'border-ge-500 bg-ge-100 text-ge-500 focus:ring-ge-500',
         },
         size: {
            default: 'px-4 py-2',
            small: 'px-3 py-1',
            medium: 'px-5 py-3',
            large: 'px-6 py-4 text-lg',
         },
      },
      defaultVariants: {
         variant: 'default',
         size: 'default',
      },
   }
);

interface TextInputProps
   extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
      VariantProps<typeof inputVariants> {
   label?: string;
   leftIcon?: React.ReactNode;
   rightIcon?: React.ReactNode;
   size?: 'default' | 'small' | 'medium' | 'large'; // Override the conflicting size type
}

const TextInput: FC<TextInputProps> = forwardRef<
   HTMLInputElement,
   TextInputProps
>(
   (
      {
         className,
         size = 'default',
         variant = 'default',
         label,
         leftIcon,
         rightIcon,
         ...props
      },
      ref
   ) => {
      return (
         <div className="flex flex-col space-y-1">
            {label && (
               <label
                  htmlFor={props.id}
                  className="text-sm font-medium text-primary-900"
               >
                  {label}
               </label>
            )}
            <div className="relative flex items-center">
               {leftIcon && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 w-3">
                     {leftIcon}
                  </span>
               )}
               <input
                  ref={ref}
                  className={cn(
                     'w-full',
                     inputVariants({ variant, size }),
                     leftIcon && 'pl-10', // Add padding for left icon
                     rightIcon && 'pr-10', // Add padding for right icon
                     className
                  )}
                  {...props}
               />
               {rightIcon && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                     {rightIcon}
                  </span>
               )}
            </div>
         </div>
      );
   }
);

TextInput.displayName = 'TextInput';

export { TextInput, inputVariants };
