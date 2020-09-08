import React, { Fragment, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import stringSimilarity from 'string-similarity';

const StyledTeleprompter = styled.div`
  border: 1px solid #ccc;
  font-size: 5.25rem;
  width: 100%;
  height: 24rem;
  overflow: scroll;
  scroll-behavior: smooth;
  display: block;
  margin: 1rem auto;
`;

const Interim = styled.div`
  background: rgb(0, 0, 0, 0.25);
  color: white;
  flex: 0 0 auto;
  padding: 0.5rem;
  border-radius: 1rem;
  display: inline-block;
`;

const cleanWord = (word) =>
    word
      .trim()
      .toLocaleLowerCase()
      .replace(/[^a-z]/gi, '');

export default function Teleprompter({ words, progress, listening, onChange }) {
  const [results, setResults] = useState('');
  const recog = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recog.current = new SpeechRecognition();
    recog.current.continuous = true;
    recog.current.interimResults = true;
  }, []);

  useEffect(() => {
    if (listening) {
      recog.current.start();
    } else {
      recog.current.stop();
    }
  }, [listening]);

  useEffect(() => {
    const handleResult = ({results}) => {
      const interim = Array.from(results)
        .filter((r) => !r.isFinal)
        .map((r) => r[0].transcript)
        .join(' ');

      setResults(interim);

      const newIndex = interim.split(' ').reduce((memo, word) => {
        if (memo >= words.length) {
          return memo;
        }
        const similarity = stringSimilarity.compareTwoStrings(
          cleanWord(word),
          cleanWord(words[memo])
        );
        memo += similarity > 0.75 ? 1 : 0;
        return memo;
      }, progress);
      if (newIndex > progress && newIndex <= words.length) {
        onChange(newIndex);
      }
    };
    recog.current.addEventListener('result', handleResult);
    return () => {
      recog.current.removeEventListener('result', handleResult);
    };
  }, [onChange, progress, words]);

  useEffect(() => {
    return scrollRef.current
      .querySelector(`[data-index='${progress + 3}']`)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
  }, [progress]);

  return (
    <Fragment>
      <StyledTeleprompter ref={scrollRef}>
        {words.map((word, i) => (
          <span
            key={`${word}:${i}`}
            data-index={i}
            style={{
              color: i < progress ? '#ccc' : '#000',
            }}
          >
            {word}{' '}
          </span>
        ))}
      </StyledTeleprompter>
      {results && <Interim>{results}</Interim>}
    </Fragment>
  );
}
