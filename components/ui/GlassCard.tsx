import React from "react";

type Props<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

export default function GlassCard<T extends React.ElementType = "div">({
  as,
  className,
  ...rest
}: Props<T>) {
  const Tag = (as || "div") as React.ElementType;
  return <Tag className={`glass ${className ?? ""}`} {...rest} />;
}
