import React from 'react';
import { Form } from './components/form/form';
import styles from './App.module.scss';

const App = () => {
    return (
        <div className={styles.main}>
            <div className={styles.ghLink}>
                <span>Check this project on </span>
                <a href="https://github.com/dmitryrodnikov/file-upload-concept">GitHub</a>
            </div>
            <h1>Upload documents</h1>
            <Form />
        </div>
    );
};

export default App;
