import React from 'react';
import { Form } from './components/form/form';
import styles from './App.module.scss';

const App = () => {
    return (
        <div className={styles.main}>
            <Form />
        </div>
    );
};

export default App;
