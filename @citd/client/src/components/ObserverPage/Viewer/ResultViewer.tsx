import * as React from 'react';

type ViewerState =
  | { iframeAPos: 'above'; iframeBPos: 'below'; iframeADoc?: string; iframeBDoc?: string }
  | { iframeAPos: 'below'; iframeBPos: 'above'; iframeADoc?: string; iframeBDoc?: string };

type ResultViewerComponentProps = {
  content: string;
};

const ResultViewerComponent: React.VFC<ResultViewerComponentProps> = ({ content }) => {
  const [state, setState] = React.useState<ViewerState>(() => ({
    iframeAPos: 'above',
    iframeBPos: 'below',
  }));

  const onLoadA = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, iframeAPos: 'above', iframeBPos: 'below' }));
  }, []);

  const onLoadB = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, iframeAPos: 'below', iframeBPos: 'above' }));
  }, []);

  React.useEffect(() => {
    setState(({ iframeAPos, iframeBPos, iframeADoc, iframeBDoc }) => {
      return iframeAPos === 'above' && iframeBPos === 'below'
        ? iframeBDoc === content
          ? { iframeBPos: 'above', iframeAPos: 'below', iframeADoc, iframeBDoc }
          : { iframeAPos: 'above', iframeBPos: 'below', iframeADoc, iframeBDoc: content }
        : iframeADoc === content
        ? { iframeAPos: 'above', iframeBPos: 'below', iframeADoc, iframeBDoc }
        : { iframeAPos: 'below', iframeBPos: 'above', iframeADoc: content, iframeBDoc };
    });
  }, [content]);

  const { iframeAPos, iframeBPos, iframeADoc, iframeBDoc } = state;

  return (
    <>
      {typeof iframeADoc === 'string' && (
        <iframe
          onLoad={onLoadA}
          srcDoc={iframeADoc}
          className={iframeAPos}
          sandbox="allow-scripts"
        />
      )}
      {typeof iframeBDoc === 'string' && (
        <iframe
          onLoad={onLoadB}
          srcDoc={iframeBDoc}
          className={iframeBPos}
          sandbox="allow-scripts"
        />
      )}
    </>
  );
};

export const ResultViewer = React.memo(ResultViewerComponent);
