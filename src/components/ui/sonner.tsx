"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        className: "rounded-2xl font-sans shadow-xl",
      }}
      {...props}
    />
  )
}

export { Toaster }
