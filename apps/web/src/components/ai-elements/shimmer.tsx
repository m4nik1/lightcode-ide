import { cn } from "../../lib/utils";
import { type ElementType, memo } from "react";

export type TextShimmerProps = {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

const ShimmerComponent = (props: TextShimmerProps) => {
  const { children, as: Component = "p", className } = props;

  return (
    <Component className={cn("shimmer-text-container", className)}>
      <span className="shimmer-text-muted">{children}</span>
      <span aria-hidden className="shimmer-overlay">
        <span className="shimmer-text">{children}</span>
      </span>
    </Component>
  );
};

export const Shimmer = memo(ShimmerComponent);
