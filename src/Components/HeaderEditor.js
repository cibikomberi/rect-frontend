import Editor from '@monaco-editor/react';
    
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

const HeaderEditor = () => {

    return ( <>
        <Editor height="100%" defaultLanguage="c" defaultValue="// some comment" theme='vs-dark' options={options}/>
    </> );
}
 
export default HeaderEditor;