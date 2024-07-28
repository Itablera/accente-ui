import React, { Component, ReactNode } from 'react';

interface ClickWrapperProps {
  children: ReactNode;
}

interface ClickWrapperState {
  showTextbox: boolean;
  clickX: number;
  clickY: number;
  inputValue: string;
}

class ClickWrapper extends Component<ClickWrapperProps, ClickWrapperState> {
  constructor(props: ClickWrapperProps) {
    super(props);
    this.state = {
      showTextbox: false,
      clickX: 0,
      clickY: 0,
      inputValue: '',
    };
  }

  handleChildClick = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, target } = event;
    const elementText = (target as HTMLElement).textContent || '';

    if ((target as HTMLElement).tagName !== 'TEXTAREA') {
      this.setState({ showTextbox: true, clickX: clientX, clickY: clientY, inputValue: elementText });
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

  handleTextboxBlur = () => {
    this.setState({ showTextbox: false });
  };

  render() {
    const { children } = this.props;
    const { showTextbox, clickX, clickY, inputValue } = this.state;

    return (
      <div onClick={this.handleChildClick}>
        {children}
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
    );
  }
}

export default ClickWrapper;


export const ClickPage: React.FC = () => {
    return (
        <ClickWrapper>
          <div id='click-container' className="wide dark-theme dark-editor prose prose-invert">
              <div>Click me!</div>
              <h1>Click me too!</h1>
          </div>
        </ClickWrapper>
    );
}