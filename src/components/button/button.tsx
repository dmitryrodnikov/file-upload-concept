import React from 'react';
import cn from 'classnames';
import styles from './button.module.scss';

interface ButtonProps {
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled }) => {
    return (
        <div className={cn(styles.container, { [styles.disabled]: disabled })}>
            <div className={styles.button}>{children}</div>
            <div className={styles.shadow} />
        </div>
    );
};
