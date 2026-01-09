import React from "react";

type Props = {
    children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export default function Header ({
    children,
    className = '',
    ...rest
}: Props) {
    const classes = [
        'header',
        className
    ].filter(Boolean).join(' ');
    return <header className={classes} {...rest}>{children}</header>;
}