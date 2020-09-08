import React, { Fragment, useState } from 'react';
import Teleprompter from './components/Teleprompter';

import {
  GlobalStyles,
  StyledApp,
  Controls,
  Buttons,
  Input,
  Button,
} from './styles';

const INITIAL_TEXT = `This is a test to see how things work. This should scroll as you approach the next word.`;

function App() {
  const [listening, setListening] = useState(false);
  const [words, setWords] = useState(INITIAL_TEXT.split(' '));
  const [progress, setProgress] = useState(0);

  const handleInput = (e) => {
    setWords(e.target.value.split(' '));
    progress && setProgress(0);
  };

  const handleListening = () => {
    if (listening) {
      setListening(false);
    } else {
      setProgress(0);
      setListening(true);
    }
  };

  const handleReset = () => setProgress(0);

  const handleChange = (progress) => setProgress(progress);

  return (
    <Fragment>
      <GlobalStyles />
      <StyledApp>
        <Controls>
          <Input onChange={handleInput} value={words.join(' ')} />
          <Buttons>
            <Button onClick={handleListening}>
              {listening ? 'Stop' : 'Start'}
            </Button>
            <Button onClick={handleReset} disabled={listening} secondary>
              Reset
            </Button>
          </Buttons>
        </Controls>
        <Teleprompter
          words={words}
          listening={listening}
          progress={progress}
          onChange={handleChange}
        />
      </StyledApp>
    </Fragment>
  );
}

export default App;
