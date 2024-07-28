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
  constructor(props: ClickWrapperProps) {
    super(props);
    this.state = {
      showTextbox: false,
      clickX: 0,
      clickY: 0,
      inputValue: 'Click me!',
      compiledCode: <>Click me!</>,
    };
  }

  handleChildClick = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, target } = event;
    const elementText = (target as HTMLElement).textContent || '';

    if ((target as HTMLElement).tagName !== 'TEXTAREA') {
      this.setState({ showTextbox: true, clickX: clientX, clickY: clientY });
        /*const textarea = document.createElement('textarea');
        textarea.value = elementText;
        textarea.setAttribute('data-prevtag', (target as HTMLElement).tagName);
        (target as HTMLElement).parentNode?.replaceChild(textarea, target as HTMLElement);
        textarea.focus();*/
    }
    else {
        const prevtag = (target as HTMLElement).getAttribute('data-prevtag') || 'div';
        (target as HTMLElement).removeAttribute('data-prevtag');
        const newElement = document.createElement(prevtag);
        newElement.textContent = (target as HTMLTextAreaElement).value;
        (target as HTMLElement).parentNode?.replaceChild(newElement, target as HTMLElement);
    }
    
  };

  handleTextboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleTextboxBlur_bak = () => {
    this.setState({ showTextbox: false });
  };

  handleTextboxBlur = () => {
    const code = String(compileSync(this.state.inputValue, {outputFormat: 'function-body'}))
    //@ts-expect-error - baseUrl is not in the official MDX API
    const compiled = runSync(code, {...runtime, baseUrl: import.meta.url});//e.target.value
    
    this.setState({ 
      showTextbox: false,
      compiledCode: compiled.default({}),
     });
};

  render() {
    const { children } = this.props;
    const { showTextbox, clickX, clickY, inputValue, compiledCode } = this.state;

    return (
      <>
      <div onClick={this.handleChildClick} className="dark-theme dark-editor prose prose-invert">
        {compiledCode}
        {showTextbox && (
          <input
            type="text"
            style={{ position: 'absolute', left: clickX, top: clickY }}
            value={inputValue}
            onChange={this.handleTextboxChange}
            onBlur={this.handleTextboxBlur}
            autoFocus={true}
          />
        )}
      </div>
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