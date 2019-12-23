import React, { Component } from 'react'

import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

class RichTextEditor extends Component {

  constructor(props) {
    super(props)
    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = { editorState }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({ editorState })
  }

  uploadImageCallback = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/manage/img/upload')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        const { url } = response.data
        resolve({ data: { link: url } })
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        resolve(error)
      })
    })
  }

  getDetailHtml = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ padding: 10, margin: 0, minHeight: 200, border: '1px solid #000' }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: { uploadCallback: this.uploadImageCallback, alt: { present: true, mandatory: true } }
        }}
      />
    )
  }
}

export default RichTextEditor