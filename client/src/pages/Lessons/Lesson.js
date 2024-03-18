import React, { useEffect, useState } from 'react';
import '../../styles/Lesson.css';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import TEST from '../../assets/test.gif';
import * as gifs from '../../assets/GIFs';
const lessonInfo = require('./Lessons.json');
const ENDPOINT = 'http://127.0.0.1:5000';  // Update with your Flask server endpoint

function Lesson() {
    const [currentTermIndex, setCurrentTermIndex] = useState(0);
    const [predictionText, setPredictionText] = useState('');
    const [textInput, setTextInput] = useState('');
    const {lessonID} = useParams();
    //for phrases
    const [phrase1, setPhrase1] = useState(['your', 'name', 'what']);
    const [phrase2, setPhrase2] = useState(['my', 'name']);
    const [phrase3, setPhrase3] = useState(['nice', 'to meet', 'you']);
    const [currentPhrase, setCurrentPhrase] = useState('');
    //terms
    const [terms, setTerms] = useState([]);
    //copied terms
    const [copiedTerms, setCopiedTerms] = useState([]);
    //typed Terms
    const [typedTerms, setTypedTerms] = useState([]);
    //finished Terms (won't be repeated)
    const [finishedTerms, setFinishedTerms] = useState([]);
    const [finishedText, setFinishedText] = useState('');
    //index of phase
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    //phases -> 1- show video copy video. 2- show video type sign. 3- show text do sign
    const [phases, setPhases] = useState([]);
    //gif names
    const gifNames = {
      //people
      brother: 'brother',
      sister: 'sister',
      father: 'father',
      friend: 'friend',
      mother: 'mother',
      //questions
      who: 'who',
      what: 'what',
      where: 'where',
      why: 'why',
      how: 'how',
      when: 'when',
      //basics
      want: 'want',
      need: 'need',
      have: 'have',
      help: 'help',
      with: 'with',
      washroom: 'washroom',
      meeting: 'meeting',
      water: 'water',
      //magic words
      please: 'please',
      'thank you': 'thank_you',
      "you're welcome": "youre_welcome",
      sorry: 'sorry',
      //alphabet
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      g: 'g',
      h: 'h',
      i: 'i',
      j: 'j',
      k: 'k',
      l: 'l',
      m: 'm',
      n: 'n',
      o: 'o',
      p: 'p',
      q: 'q',
      r: 'r',
      s: 's',
      t: 't',
      u: 'u',
      v: 'v',
      w: 'w',
      x: 'x',
      y: 'y',
      z: 'z',
      "my name is": 'my_name_is',
      "nice to meet you": 'nice_to_meet_you',
      goodbye: 'goodbye',
      'see you tomorrow': 'see_you_tomorrow',
      today: 'today',
      tomorrow: 'tomorrow',
      day: 'day',
      night: 'night'
    };
    useEffect(()=>{
      //get the lesson terms, scramble them
      const str = lessonID.split("-");
      const lessonNum = str[0];
      const lessonTitle = str[1];
      const lesson = lessonInfo[`lesson${lessonNum}`].find(lesson => lesson.title === lessonTitle);
      let terms = lesson ? lesson.terms : [];
      shuffleArray(terms);
      terms = terms.slice(0, 5);
      setTerms(terms);
      setPhases(['Copy the Sign Shown: ', 'Type the Sign Shown: ', 'Sign the Text Shown: ']);
    }, [lessonID]);
    useEffect(()=>{
      //checking for phrases
      //'Nice to meet you'
      // 'nice' --> 'to meet' --> 'you'
      if (phases[currentPhaseIndex] === 'Copy the Sign Shown: '){
        //if this phase, conditionally check phrase
        if (terms[currentTermIndex].toLowerCase().trim()==='what is your name?'){
          if (predictionText.trim() === 'your'){
            //append to currentPhrase only if currentPhrase is empty
            if (currentPhrase === ''){
              setCurrentPhrase('your');
            }
          }
          //check for 'name'
          if (predictionText.trim() === 'name'){
            //append to currentPhrase only if currentPhrase is only 'your'
            if (currentPhrase === 'your'){
              setCurrentPhrase('your name');
            }
          }
          //check for 'what'
          if (predictionText.trim() === 'what'){
            //if already signed 'your name', move on to next work, reset current phrase
            if (currentPhrase === 'your name'){
              setCurrentPhrase('');
              handleNextTerm(); handleTermCopied(); handleNextPhase();
            }
          }
        }
        //if this phase, conditionally check phrase
        if (terms[currentTermIndex].toLowerCase().trim()==='my name is'){
          if (predictionText.trim() === 'my'){
            //append to currentPhrase only if currentPhrase is empty
            if (currentPhrase === ''){
              setCurrentPhrase('my');
            }
          }
          //check for 'name'
          if (predictionText.trim() === 'name'){
            //append to currentPhrase only if currentPhrase is only 'your'
            if (currentPhrase === 'my'){
              setCurrentPhrase('');
              handleNextTerm(); handleTermCopied(); handleNextPhase();
            }
          }
        }
        else{
          //not one of the phrases
          if (predictionText.trim() === terms[currentTermIndex].toLowerCase().trim()){
            handleNextTerm(); handleTermCopied(); handleNextPhase();
          } 
        }

        }else if (phases[currentPhaseIndex] === 'Sign the Text Shown: '){
          //if this phase, conditionally check phrase
          if (typedTerms[0].toLowerCase().trim()==='what is your name'){
            if (predictionText.trim() === 'your'){
              //append to currentPhrase only if currentPhrase is empty
              if (currentPhrase === ''){
                setCurrentPhrase('your');
              }
            }
            //check for 'name'
            if (predictionText.trim() === 'name'){
              //append to currentPhrase only if currentPhrase is only 'your'
              if (currentPhrase === 'your'){
                setCurrentPhrase('your name');
              }
            }
            //check for 'what'
            if (predictionText.trim() === 'what'){
              //if already signed 'your name', move on to next work, reset current phrase
              if (currentPhrase === 'your name'){
                setCurrentPhrase('');
                handleTermFinished(); handleNextPhase();
              }
            }
          }
          else if (typedTerms[0].toLowerCase().trim()==='my name is'){
            if (predictionText.trim() === 'my'){
              //append to currentPhrase only if currentPhrase is empty
              if (currentPhrase === ''){
                setCurrentPhrase('my');
              }
            }
            //check for 'name'
            if (predictionText.trim() === 'name'){
              //append to currentPhrase only if currentPhrase is only 'your'
              if (currentPhrase === 'my'){
                setCurrentPhrase('');
                handleTermFinished(); handleNextPhase();
              }
            }
          }
          // not phrase
          else{
            if (predictionText.trim()===typedTerms[0].toLowerCase().trim()){
            handleTermFinished(); handleNextPhase();
          }
        }
      }
    }, [predictionText]);
    useEffect(() => {
      const socket = socketIOClient(ENDPOINT);
      socket.on('connect', () => {
        console.log('Connected to server');
      });
    
      socket.on('sentence', data => {
        console.log('Received sentence:', data.sentence);
        setPredictionText(data.sentence.toString());
      });
    
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    
      return () => {
        socket.disconnect();
      };
    }, []);  
    const handleNextTerm = () => { 
      setCurrentTermIndex(prevIndex => (prevIndex + 1) % terms.length);
    };
    const handleTermCopied = () =>{
      //add copied term
      setCopiedTerms(prev => [...prev, terms[currentTermIndex]]);
    }
    const handleTermTyped = () =>{
      //add typed term, remove copied term
      setTypedTerms(prev => [...prev, copiedTerms[0]]);
      setCopiedTerms(prev => prev.slice(1));
    }
    const handleTermFinished = () =>{
      setFinishedTerms(prev => [...prev, typedTerms[0]]);
      setTypedTerms(prev => prev.slice(1));
      console.log('finished length: ' + finishedTerms.length);
      console.log('terms length: ' + terms.length);
      if ((finishedTerms.length+1)===terms.length){
        setFinishedText('Congratulations! You finished your lesson.');
        setPhases(['Done']);
      }
    }
    const handleNextPhase = () => {
      const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      //only move forward if terms exist
      if (termsForPhaseExist(nextPhaseIndex)) {
          setCurrentPhaseIndex(nextPhaseIndex);
      }
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleTermSubmit = () => {
    if (textInput.toLowerCase().trim() === copiedTerms[0].toLowerCase().trim()){
      handleTermTyped(); handleNextPhase();
      setTextInput('');
    }
};

  const termsForPhaseExist = (phaseIndex) => {
      switch (phaseIndex) {
          case 0:
              return terms.length > 0;
          case 1:
              return copiedTerms.length > 0;
          case 2:
              return typedTerms.length > 0;
          default:
              return true;
      }
  };

    return (
      <div className='lesson'>
            <Navbar />
            <h1>Lesson {lessonID}</h1>
            {phases[currentPhaseIndex] === 'Copy the Sign Shown: ' && (
                <div>
                    <h1>{phases[currentPhaseIndex]}"{terms[currentTermIndex]}"</h1>
                    <img src={gifs[gifNames[terms[currentTermIndex].toLowerCase()]]}/>
                    <img src="http://127.0.0.1:5000/video_feed" alt="Prediction" />
                    <button onClick={() => { handleNextTerm(); handleTermCopied(); handleNextPhase();}}>Next Term</button>
                </div>
            )}
            {phases[currentPhaseIndex] === 'Type the Sign Shown: ' && (
                <div>
                    <h1>{phases[currentPhaseIndex]}</h1>
                    <img src={gifs[gifNames[copiedTerms[0].toLowerCase()]]}/>
                    <input 
                      type='text' 
                      placeholder='Input sign here...'
                      value={textInput}
                      onChange={handleInputChange}
                    />
                    <button onClick={() => { handleTermSubmit()}}>Submit</button>
                    <button onClick={() => { handleTermTyped(); handleNextPhase();}}>Next Term</button>
                </div>
            )}
            {phases[currentPhaseIndex] === 'Sign the Text Shown: ' && (
                <div>
                    <h1>{phases[currentPhaseIndex]}"{typedTerms[0]}"</h1>
                    <img src="http://127.0.0.1:5000/video_feed" alt="Prediction" />
                    <button onClick={() => { handleTermFinished(); handleNextPhase();}}>Next Term</button>
                </div>
            )}
            {finishedText === 'Congratulations! You finished your lesson.' && (
                <div>
                    <h1>{finishedText}</h1>
                    <Link to="/lessons">
                      <button>Go back to lessons</button>
                    </Link>
                    
                </div>
            )}
            <div>

            </div>
        </div>
      );
}

// Fisher-Yates (Knuth) shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default Lesson;