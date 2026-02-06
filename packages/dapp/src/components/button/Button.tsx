import { ButtonHTMLAttributes, FC, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
   'inline-flex justify-center items-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 ease-in-out', // Shared styles with animations
   {
      variants: {
         variant: {
            default:
               'border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-900/95 focus:ring-neutral-900',
            outline:
               'border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-50/60 focus:ring-neutral-100',
            danger:
               'border border-red-500 bg-red-100 text-red-500 hover:bg-red-500 hover:text-neutral-50 focus:ring-red-500',
            success:
               'border border-green-500 bg-green-100 text-ge-500 hover:bg-green-500 hover:text-neutral-50 focus:ring-green-500',
            white: 'border border-neutral-50 bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-300',
         },
         size: {
            default: 'px-4 py-2 text-sm',
            small: 'px-3 py-1 text-xs',
            medium: 'px-5 py-3 text-base',
            large: 'px-6 py-4 text-lg',
         },
      },
      defaultVariants: {
         variant: 'default',
         size: 'default',
      },
   }
);

interface ButtonProps
   extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {}

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, size, variant, ...props }, ref) => {
      return (
         <button
            className={cn(
               'font-[system-ui]', // Enforces system-ui font
               buttonVariants({ variant, size }),
               className
            )}
            ref={ref}
            {...props}
         >
            {props.children}
         </button>
      );
   }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
