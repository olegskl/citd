import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';

import { CodeEditorHookOptions, useCodeEditor } from './useCodeEditor';

const meta = {
  title: 'useCodeEditor',
  component: CodeEditorStory,
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {},
} satisfies Meta<typeof CodeEditorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Editor: Story = {
  args: {
    autoFocus: true,
    readOnly: false,
  },
};

export const Viewer: Story = {
  args: {
    autoFocus: false,
    readOnly: true,
  },
};

function CodeEditorStory({ autoFocus, onChange, readOnly = false }: CodeEditorHookOptions) {
  const { containerRef, editor } = useCodeEditor({ autoFocus, onChange, readOnly });
  useEffect(() => {
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;
    model.applyEdits([
      {
        range: { startColumn: 0, startLineNumber: 0, endColumn: 0, endLineNumber: 0 },
        text,
      },
    ]);
  }, [editor]);
  return <div ref={containerRef} className="code-editor" />;
}

const text = `<!doctype html>
<html>

<head>
  <style>
    .foo {
      background: red;
    }
  </style>
  <script>
    const a = 42;
    console.log(a);
  </script>
</head>

<body>
  <div class="foo">Hello editor!</div>
</body>

</html>
`;
