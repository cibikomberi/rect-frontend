import debounce from 'lodash.debounce'; // Install lodash.debounce using npm/yarn
import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Button, TextInput } from '@carbon/react';
import { Save } from '@carbon/icons-react';

const options = {
    autoIndent: 'full',
    contextmenu: true,
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: 'always',
    minimap: {
        enabled: true,
    },
    scrollbar: {
        horizontalSliderSize: 4,
        verticalSliderSize: 18,
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
};

const HeaderEditor = ({ deviceId }) => {
    const [editorValue, setEditorValue] = useState("// some constants");
    const [version, setVersion] = useState("");

    // Debounced save handler
    const saveValue = useCallback(
        debounce((value) => {
            setEditorValue(value);
            console.log("Saving value:", value); // Replace this with your save logic (e.g., API call, local storage)
        }, 500), // Debounce for 500ms
        []
    );

    const saveHeader = () => {
        axios.post(`/device/constants/${deviceId}/${version}`, editorValue).then((res) => console.log(res))
    }

    const handleEditorChange = (value) => {
        saveValue(value); // Save with debounce
    };
    return (<>
        <TextInput
            id="text-input-version-name"
            labelText="Version"
            value={version}
            onChange={(e) => {
                setVersion(e.target.value);
            }}
        />
        <Editor
            height="100%"
            defaultLanguage="c"
            defaultValue="// some comment"
            theme='vs-dark'
            options={options}
            value={editorValue}
            onChange={handleEditorChange}
        />
        <Button renderIcon={Save} onClick={saveHeader}>Save</Button>

    </>);
}

export default HeaderEditor; 