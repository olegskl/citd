import * as monaco from 'monaco-editor';
import './theme.css';

export const theme = 'bauhaus';

monaco.editor.defineTheme(theme, {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { foreground: 'c7a429', token: 'tag' },
    { foreground: '1986bc', token: 'tag.css' },
    { foreground: '1986bc', token: 'attribute.name.html' },
    { foreground: 'c3351c', token: 'attribute.value.html' },
    { background: '1986bc', token: 'delimiter.bracket.css' }, // doesn't work, see css override
  ],
  colors: {
    'editor.foreground': '#cfd8cc',
    'editor.background': '#191c1b',
    'editor.selectionBackground': '#77211280',
  },
});
