import { Save } from '@carbon/icons-react';
import { Button, Dropdown } from '@carbon/react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import debounce from 'lodash.debounce'; // Install lodash.debounce using npm/yarn
import React, { useCallback, useEffect, useState } from 'react';

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
    const [versionList, setVersionList] = useState([]);

    useEffect(() => {
        axios.get(`/device/versions/${deviceId}`)
            .then(res => res.data)
            .then((data) => setVersionList(data))

    }, [deviceId])

    useEffect(() => {
        if (version) {
            axios.get(`/device/constants/${deviceId}/${version}`)
                .then(res => res.data)
                .then((data) => setEditorValue(data))
        }
    }, [version, deviceId])

    // Debounced save handler
    const saveValue = useCallback(
        debounce((value) => {
            setEditorValue(value);
            console.log("Saving value:", value); // Replace this with your save logic (e.g., API call, local storage)
        }, 500), // Debounce for 500ms
        []
    );

    const saveHeader = () => {
        axios.post(`/device/constants/${deviceId}/${version}`, editorValue, {
            headers: {
                'Content-Type': 'text/plain', // Specify plain text content
            }
        }).then((res) => console.log(res))
    }

    const handleEditorChange = (value) => {
        saveValue(value); // Save with debounce
    };
    return (<>
        <Dropdown
            id="text-input-version-name"
            label="Version"
            titleText="Select Version"
            selectedItem={version}
            items={versionList}
            onChange={(e) => {
                setVersion(e.selectedItem);
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