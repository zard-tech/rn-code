import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor,
  lineNumbers, highlightActiveLineGutter} from '@codemirror/view'
import {Extension, EditorState} from '@codemirror/state'
import {defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
  foldGutter, foldKeymap} from '@codemirror/language'
import {defaultKeymap, history, historyKeymap} from '@codemirror/commands'
import {searchKeymap, highlightSelectionMatches} from '@codemirror/search'
import {autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap} from '@codemirror/autocomplete'
import {lintKeymap} from '@codemirror/lint'

import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { javascript } from '@codemirror/lang-javascript'
import { php } from '@codemirror/lang-php'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'

export const EditorConfigEnum = {
  LINE_NUMBERS: 'LINE_NUMBERS',
  HIGHLIGHT_ACTIVE_LINE_GUTTER: 'HIGHLIGHT_ACTIVE_LINE_GUTTER',
  HIGHLIGHT_SPECIAL_CHARS: 'HIGHLIGHT_SPECIAL_CHARS',
  HISTORY: 'HISTORY',
  FOLD_GUTTER: 'FOLD_GUTTER',
  DRAW_SELECTION: 'DRAW_SELECTION',
  DROP_CURSOR: 'DROP_CURSOR',
  ALLOW_MULTIPLE_SELECTIONS: 'ALLOW_MULTIPLE_SELECTIONS',
  INDENT_ON_INPUT: 'INDENT_ON_INPUT',
  SYNTAX_HIGHLIGHTING: 'SYNTAX_HIGHLIGHTING',
  BRACKET_MATCHING: 'BRACKET_MATCHING',
  CLOSE_BRACKETS: 'CLOSE_BRACKETS',
  AUTOCOMPLETE: 'AUTOCOMPLETE',
  RECTANGULAR_SELECTION: 'RECTANGULAR_SELECTION',
  CROSSHAIR_CURSOR: 'CROSSHAIR_CURSOR',
  HIGHLIGHT_ACTIVE_LINE: 'HIGHLIGHT_ACTIVE_LINE',
  HIGHLIGHT_SELECTION_MATCHES: 'HIGHLIGHT_SELECTION_MATCHES',
  KEY_MAPPINGS: 'KEY_MAPPINGS',
  
  LANGUAGE: 'LANGUAGE'
}

export const LanguagesEnum = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  php: 'php',
  rust: 'rust',
}

const ConfigExtensionMapping = {
  [EditorConfigEnum.LINE_NUMBERS]: () => lineNumbers(),
  [EditorConfigEnum.HIGHLIGHT_ACTIVE_LINE_GUTTER]: () => highlightActiveLineGutter(),
  [EditorConfigEnum.HIGHLIGHT_SPECIAL_CHARS]: () => highlightSpecialChars(),
  [EditorConfigEnum.HISTORY]: () => history(),
  [EditorConfigEnum.FOLD_GUTTER]: () => foldGutter(),
  [EditorConfigEnum.DRAW_SELECTION]: () => drawSelection(),
  [EditorConfigEnum.DROP_CURSOR]: () => dropCursor(),
  [EditorConfigEnum.ALLOW_MULTIPLE_SELECTIONS]: () => EditorState.allowMultipleSelections.of(true),
  [EditorConfigEnum.INDENT_ON_INPUT]: () => indentOnInput(),
  [EditorConfigEnum.SYNTAX_HIGHLIGHTING]: () => syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
  [EditorConfigEnum.BRACKET_MATCHING]: () => bracketMatching(),
  [EditorConfigEnum.CLOSE_BRACKETS]: () => closeBrackets(),
  [EditorConfigEnum.AUTOCOMPLETE]: () => autocompletion(),
  [EditorConfigEnum.RECTANGULAR_SELECTION]: () => rectangularSelection(),
  [EditorConfigEnum.CROSSHAIR_CURSOR]: () => crosshairCursor(),
  [EditorConfigEnum.HIGHLIGHT_ACTIVE_LINE]: () => highlightActiveLine(),
  [EditorConfigEnum.HIGHLIGHT_SELECTION_MATCHES]: () => highlightSelectionMatches(),
  
  [EditorConfigEnum.KEY_MAPPINGS]: () => {
    return keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
    ])
  },

  [EditorConfigEnum.LANGUAGE]: (language) => {
    switch (language) {
      case LanguagesEnum.cpp: 
        return cpp()

      case LanguagesEnum.java:
        return java()

      case LanguagesEnum.javascript:
        return javascript()

      case LanguagesEnum.php:
        return php()

      case LanguagesEnum.python:
        return python()

      case LanguagesEnum.rust:
        return rust()
    }

    return undefined
  }
}

export const defaultConfig = {
  [EditorConfigEnum.LINE_NUMBERS]: true,
  [EditorConfigEnum.HIGHLIGHT_ACTIVE_LINE_GUTTER]: true,
  [EditorConfigEnum.HIGHLIGHT_SPECIAL_CHARS]: true,
  [EditorConfigEnum.HISTORY]: true,
  [EditorConfigEnum.FOLD_GUTTER]: true,
  [EditorConfigEnum.DRAW_SELECTION]: true,
  [EditorConfigEnum.DROP_CURSOR]: true,
  [EditorConfigEnum.ALLOW_MULTIPLE_SELECTIONS]: true,
  [EditorConfigEnum.INDENT_ON_INPUT]: true,
  [EditorConfigEnum.SYNTAX_HIGHLIGHTING]: true,
  [EditorConfigEnum.BRACKET_MATCHING]: true,
  [EditorConfigEnum.CLOSE_BRACKETS]: true,
  [EditorConfigEnum.AUTOCOMPLETE]: true,
  [EditorConfigEnum.RECTANGULAR_SELECTION]: true,
  [EditorConfigEnum.CROSSHAIR_CURSOR]: true,
  [EditorConfigEnum.HIGHLIGHT_ACTIVE_LINE]: true,
  [EditorConfigEnum.HIGHLIGHT_SELECTION_MATCHES]: true
}

export function getExtensionsList(config) {
  const extensions = []

  const configObj = Object.assign(defaultConfig, config)

  for (const key in configObj) {
    const value = configObj[key]
    if (!(key in ConfigExtensionMapping) || !value) {
      continue
    }

    const generator = ConfigExtensionMapping[key]
    if (typeof generator === 'function') {
      extensions.push(generator(value))
    }
  }

  return extensions.filter(e => e)
}
