import React, { Component } from 'react';
import { compileSync, runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { VFile } from 'vfile';

interface ClickWrapperProps {
}

interface ClickWrapperState {
  showTextbox: boolean;
  clickX: number;
  clickY: number;
  inputValue: string;
  compiledCode: JSX.Element;
}

class ClickWrapper extends Component<ClickWrapperProps, ClickWrapperState> {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  constructor(props: ClickWrapperProps) {
    super(props);
    this.state = {
      showTextbox: false,
      clickX: 0,
      clickY: 0,
      inputValue: 'Click me!',
      compiledCode: <>Click me!</>,
    };
    this.textareaRef = React.createRef();
  }

  handleChildClick = () => {
    this.setState({ showTextbox: true });
  };

  handleTextboxChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ inputValue: event.target.value }, this.adjustTextareaHeight);
  };

  handleDivFocus = () => {
    this.setState({ showTextbox: true });
  };

  handleTextboxBlur = (event: React.ChangeEvent<HTMLDivElement>) => {
    const codeString = event.target.innerText || '';
    // Create virtual file, vFile, to store the code
    const vFile = new VFile({
      basename: 'example.mdx',
      value: codeString,

    })
    const code = String(compileSync(vFile, {outputFormat: 'function-body'}))
    //@ts-expect-error - baseUrl is not in the official MDX API
    const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});
    
    this.setState({ 
      showTextbox: false,
      compiledCode: compiled.default({}),
      inputValue: codeString
    });
  };

  adjustTextareaHeight = () => {
    const textarea = this.textareaRef.current as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto to calculate the new height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
    }
  };

  componentDidMount() {
    this.adjustTextareaHeight();
  }

  componentDidUpdate() {
    this.adjustTextareaHeight();
  }

  render() {
    const { showTextbox, inputValue, compiledCode } = this.state;

    return (
      <>
        <div 
        className="dark-theme dark-editor prose prose-invert"
        onFocus={this.handleDivFocus}
        onBlur={this.handleTextboxBlur}
        contentEditable={true}
        suppressContentEditableWarning={true} >
          {showTextbox && inputValue || compiledCode}
        </div>
      </>
    );
  }
}

export default ClickWrapper;


export const ClickPage: React.FC = () => {
    return (
        <ClickWrapper />
    );
}