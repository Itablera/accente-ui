import React, { Component, ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react'
import { compileSync, runSync } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

interface ClickWrapperProps {
  children: ReactNode;
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

  handleTextboxBlur = () => {
    const code = String(compileSync(this.state.inputValue, {outputFormat: 'function-body'}))
    //@ts-expect-error - baseUrl is not in the official MDX API
    const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});
    
    this.setState({ 
      showTextbox: false,
      compiledCode: compiled.default({}),
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
        {!showTextbox && (
      <div onClick={this.handleChildClick} className="dark-theme dark-editor prose prose-invert">
        {!showTextbox && compiledCode}
          </div>
        )}
        {showTextbox && (
          <div>
            {showTextbox && (
              <textarea
                ref={this.textareaRef}
                value={inputValue}
                onChange={this.handleTextboxChange}
                onBlur={this.handleTextboxBlur}
                autoFocus={true}
                style={{ width: 'fit-content', height: 'auto', overflow: 'hidden' }}
          />
        )}
      </div>
        )}
      </>
    );
  }
}

export default ClickWrapper;


export const ClickPage: React.FC = () => {
    return (
        <ClickWrapper>
          <div id='click-container' className="dark-theme dark-editor prose prose-invert">
              <div>Click me!</div>
              <h1>Click me too!</h1>
          </div>
        </ClickWrapper>
    );
}