import * as React from "react";
import { IconProps } from "./IconsTypes";

export function RoomsIcon({ size = 18, className, ...props }: IconProps) {
    return (
        <svg
            className={className} width={size} height={size} viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth={2}
            {...props}
        >
            <rect x="3" y="7" width="7" height="10" />
            <rect x="14" y="7" width="7" height="10" />
        </svg>
    );
}
