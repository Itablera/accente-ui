import React, { Component } from 'react';
import { compileSync, runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { VFile } from 'vfile';

interface ClickWrapperProps {
  inputValue?: string;
}

interface ClickWrapperState {
  showTextbox: boolean;
  plainText: string;
  compiledCode: JSX.Element;
}

class ClickWrapper extends Component<ClickWrapperProps, ClickWrapperState> {
  constructor(props: ClickWrapperProps) {
    super(props);
    this.state = {
      showTextbox: false,
      plainText: props.inputValue || 'Click me!',
      compiledCode: props.inputValue && this.compile(props.inputValue) ||<>Click me!</>,
    };
  }

  handleDivFocus = () => {
    this.setState({ showTextbox: true });
  };

  compile(codeString = '') {
    // Create virtual file, vFile, to store the code
    const vFile = new VFile({
      basename: 'example.mdx',
      value: codeString,

    })
    const code = String(compileSync(vFile, {outputFormat: 'function-body'}))
    //@ts-expect-error - baseUrl is not in the official MDX API
    const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});

    return compiled.default({});
  }

  handleTextboxBlur = (event: React.ChangeEvent<HTMLDivElement>) => {
    const codeString = event.target.innerText || '';
    
    this.setState({ 
      showTextbox: false,
      compiledCode: this.compile(codeString),
      plainText: codeString
    });
  };

  render() {
    const { showTextbox, plainText: inputValue, compiledCode } = this.state;

    return (
      <>
        <div 
        className="dark-theme dark-editor prose prose-invert"
        style={showTextbox && { whiteSpace: 'pre-line' } || {}}
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
        <ClickWrapper inputValue='# Hej' />
    );
}