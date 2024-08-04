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

  handleDivFocus = () => {
    this.setState({ showTextbox: true });
  };

  handleTextboxBlur = () => {
    const codeString = this.state.inputValue;
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
      compiledCode: compiled.default({})
    });
  };

  render() {
    const { showTextbox, inputValue, compiledCode } = this.state;

    return (
      <>
        {!showTextbox && 
        <div
        onClick={this.handleDivFocus} 
        className="dark-theme dark-editor prose prose-invert">
          {compiledCode}
        </div>
        }
        {showTextbox &&
        <div
        className="dark-theme dark-editor prose prose-invert"
        >
          <textarea 
          rows={inputValue.split('\n').length + 1}
          value={inputValue}
          onChange={(event) => this.setState({ inputValue: event.target.value })}
          onBlur={this.handleTextboxBlur}
          autoFocus={true}
          spellCheck={false} />
        </div>
      }
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