import React, { Component } from 'react';
import { compileSync, runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { VFile } from 'vfile';

interface ClickWrapperProps {
  children?: React.ReactNode;
}

interface ClickWrapperState {
  showTextbox: boolean;
  inputValue: string;
  compiledCode: JSX.Element;
}

class ClickWrapper extends Component<ClickWrapperProps, ClickWrapperState> {
  constructor(props: ClickWrapperProps) {
    super(props);
    this.state = {
      showTextbox: false,
      inputValue: 'Click me!',
      compiledCode: <>Click me!</>,
    };
  }

  handleChildClick = () => {
    this.setState({ showTextbox: true });
  };

  handleTextboxChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ inputValue: event.target.value });
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