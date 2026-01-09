import React from "react";

type Props = {
    gradient?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Footer ({
    gradient = false,
    className = '',
    ...rest
}: Props) {
    const classes = [
        'footer',
        gradient && 'footer--gradient',
        className
    ].filter(Boolean).join(' ');

    return <div className={classes} {...rest} />;
}