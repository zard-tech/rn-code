import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WebView } from 'react-native-webview'

import jsonDoc from './generated/editor.json'

const htmlDoc = JSON.parse(jsonDoc[0])

const RNCodeEditor = ({
  initialValue, 
  onValueChanged,
  onReady,

  // Config options
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  history,
  foldGutter,
  drawSelection,
  dropCursor,
  allowMultipleSelections,
  indentOnInput,
  syntaxHighlighting,
  bracketMatching,
  closeBrackets,
  autoComplete,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  highlightSelectionMatches,

  language,
  theme
}) => {
  const webRef = useRef()

  const [ready, setReady] = useState(false)

  const invokeMethod = useCallback((method, payload) => {
    webRef.current.injectJavaScript(`
      (function() {
        window.ztCodeBridge.dispatch('${method}', ${JSON.stringify(payload)});
      })();
      true;
    `)
  }, [webRef.current])

  const updateConfig = (newConfig, value) => {
    invokeMethod('CONFIG', {
      config: newConfig,
      value
    })
  }

  const currentConfig = useMemo(() => {
    return {
      LANGUAGE: language,
      THEME: theme,

      LINE_NUMBERS: lineNumbers,
      HIGHLIGHT_ACTIVE_LINE_GUTTER: highlightActiveLineGutter,
      HIGHLIGHT_SPECIAL_CHARS: highlightSpecialChars,
      HISTORY: history,
      FOLD_GUTTER: foldGutter,
      DRAW_SELECTION: drawSelection,
      DROP_CURSOR: dropCursor,
      ALLOW_MULTIPLE_SELECTIONS: allowMultipleSelections,
      INDENT_ON_INPUT: indentOnInput,
      SYNTAX_HIGHLIGHTING: syntaxHighlighting,
      BRACKET_MATCHING: bracketMatching,
      CLOSE_BRACKETS: closeBrackets,
      AUTOCOMPLETE: autoComplete,
      RECTANGULAR_SELECTION: rectangularSelection,
      CROSSHAIR_CURSOR: crosshairCursor,
      HIGHLIGHT_ACTIVE_LINE: highlightActiveLine,
      HIGHLIGHT_SELECTION_MATCHES: highlightSelectionMatches,
    }
  }, [
    language,
    theme,
    lineNumbers,
    highlightActiveLineGutter,
    highlightSpecialChars,
    history,
    foldGutter,
    drawSelection,
    dropCursor,
    allowMultipleSelections,
    indentOnInput,
    syntaxHighlighting,
    bracketMatching,
    closeBrackets,
    autoComplete,
    rectangularSelection,
    crosshairCursor,
    highlightActiveLine,
    highlightSelectionMatches
  ])

  useEffect(() => {
    if (!ready) return

    updateConfig(currentConfig)
  }, [ready, currentConfig])

  const messageHandler = (event) => {
    const { type, payload } = JSON.parse(event.nativeEvent.data)
    
    switch (type) {
      case 'BOOTSTRAPPED':
        updateConfig(currentConfig, initialValue)
        break

      case 'READY':
        setReady(true)
        if (typeof onReady === 'function') {
          onReady()
        }
        break

      case 'DOC_CHANGED':
        if (typeof onValueChanged === 'function') {
          onValueChanged(payload)
        }
        break
    }
  }

  return (
    <WebView 
      ref={webRef}
      originWhitelist={['*']}
      source={{ 
        html: htmlDoc
      }}
      onMessage={messageHandler}
      style={{
        flex: 1,
        height: '100%'
      }}
    />
  )
}

export default RNCodeEditor
