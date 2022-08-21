import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import EVENTS from './events'
import { getExtensionsList } from './extensions'

import './styles.css'

class CodeEditor {
  constructor() {
    this.destroyed = false

    window.ztCodeBridge = {
      dispatch: this._handler.bind(this)
    }

    document.addEventListener('click', () => {
      this.focus()
    })

    this.notify(EVENTS.BOOTSTRAPPED)
  }

  destroy() {
    this.destroyed = true
    this.view?.destroy()
  }

  isActive() {
    return !this.destroyed && this.isOpen()
  }

  isOpen() {
    return Boolean(window.ReactNativeWebView)
  }

  notify(type, payload) {
    if (!this.isActive()) {
      console.warn('Skipping notification:', { type, payload })
      return
    }

    return window.ReactNativeWebView.postMessage(JSON.stringify({
      type,
      payload
    }))
  }

  _handler(method, payload) {
    if (!this.isActive()) {
      console.warn('Skipping message:', { method, payload })
      return
    }

    if (method === 'CONFIG') {
      this.resetState(payload)
      return
    }

    const cb = this[`__internal__${method}`]

    if (typeof cb !== 'function') {
      console.warn('Skipping unknown method', { method, payload })
      // this.notify('WARN', { errorType: 'UNKNOWN_METHOD', method, payload })
      return
    }

    try {
      cb.call(this, payload)
    } catch (err) {
      console.warn('Error executing command', err)
    }
  }

  _getDocChangeNotifier() {
    return EditorView.updateListener.of(
      (update) => {
        if (update?.docChanged) {
          const newText = update.state.doc.toString()
          this.notify(EVENTS.DOC_CHANGED, newText)
        }
      }
    )
  }

  resetState({ config, value }) {
    const currentValue = this.state?.doc?.toString() || ''

    this.state = EditorState.create({
      doc: typeof value === 'string' ? value : currentValue,
      extensions: [
        this._getDocChangeNotifier(),
        ...getExtensionsList(config)
      ]
    })

    this.currentConfig = config

    if (this.view) {
      this.view.setState(this.state)

      this.notify(EVENTS.CONFIG_UPDATED)
    } else {
      this.view = new EditorView({
        state: this.state,
        parent: document.getElementById('root')
      })

      this.notify(EVENTS.READY)
    }
  }

  __internal__setText(text) {
    this.resetState({
      config: this.currentConfig,
      value: text
    })
  }

  __internal__focus() {
    if (!this.view?.hasFocus()) {
      this.view?.focus()
    }
  }
}

export default CodeEditor
