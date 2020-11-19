import React from 'react';
import cn from 'classnames';
import styles from './button.module.scss';

interface ButtonProps {
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled }) => {
    return <div className={cn(styles.button, { [styles.disabled]: disabled })}>{children}</div>;
};
