import { useEffect, useState } from 'react';
import './App.css';

interface Equation {
  lhs?:number;
  op?:string
}
enum ButtonType {
  OPERATOR='operator',
  NUMBER = 'number',
  OTHER = 'other'
}
function App() {
  const [history,setHistory] = useState("");
  const [display,setDisplay] = useState("0");
  const [equation,setEquation] = useState<Equation>({});
  const [override,setOverride] = useState(true);
  const popMemory = () => {
    const get = async () => {
      let resp = await fetch('/api/pop');
      let text = await resp.text();
      if(resp.status===200) {
        setDisplay(text);
      }
    }
    get();
  }
  const storeInMemory = () => {
    const post = async () => {
      let resp = await fetch('/api/store',{method:'POST',body:display.toString()});
      let text = await resp.text();
      
    }
    post();
  }
  const plusMinusClick = () => {
    if(display.startsWith('-')) {
        setDisplay(display.substr(1));
    } else {
      if(display==='0') {
        setDisplay('-');
      } else {
      setDisplay('-'+display);
      }
    }
  }
  const clearDisplay = () => {
    if(display==="0") {
      setHistory(" ");
    } else {
      setDisplay("0");
    }
  }
  const evalDisplay = () => {
    if(override) return;
    const rhs = Number.parseFloat(display);
    let result = 0;
    if(equation.op && equation.lhs) {
      setHistory(" ");
      switch(equation.op) {
        case '+':
          result = equation.lhs + rhs;
          break;
        case '-':
          result = equation.lhs - rhs;
          break;
        case '×':
          result = equation.lhs * rhs;
          break;
        case '÷':
          if(rhs!==0) {
            result = equation.lhs / rhs;
          } else {
            setDisplay("Nem lehet 0-val osztani");
            setOverride(true);
            setEquation({});
            return;
          }
          break;
      }
      return result;
    }
  }
  const addToDisplay = (s: string) => {
    return () => {
      if(override || display==='0') {
        setDisplay(s);
        setOverride(false);
      } else {
        setDisplay(display + s);
      }
    }
  }
  const operatorClick = (op : string) => {
    return () => {
      if(display==='') return;
      if(!override) {
        if(!equation.lhs) { 
          const lhs = Number.parseFloat(display);
          setEquation({lhs,op});
          setHistory(lhs+op)
          setDisplay("0");
        } else {
          const old = display;
          const lhs = evalDisplay();
          setEquation({lhs,op});
          setHistory(lhs+op);
          setDisplay(old);

        }
      } 
    }
  }

  const equalsClick = () => {
    if(display==='') return;
    const result = evalDisplay();
    if(result) {
      setDisplay(result.toString());
      setEquation({});
    }
  }

  const buttons = [
    [
      { text: "M-", fn: popMemory, type:ButtonType.OTHER },
      { text: "M+", fn: storeInMemory, type:ButtonType.OTHER },
      { text: "C", fn: clearDisplay, type:ButtonType.OTHER },
      { text: "÷", fn: operatorClick("÷"),type:ButtonType.OPERATOR }
    ],
    [
      { text: "7", fn: addToDisplay("7"), type:ButtonType.NUMBER },
      { text: "8", fn: addToDisplay("8"), type:ButtonType.NUMBER },
      { text: "9", fn: addToDisplay("9"), type:ButtonType.NUMBER },
      { text: "×", fn: operatorClick("×"),type:ButtonType.OPERATOR }
    ],
    [
      { text: "4", fn: addToDisplay("4"), type:ButtonType.NUMBER },
      { text: "5", fn: addToDisplay("5"), type:ButtonType.NUMBER },
      { text: "6", fn: addToDisplay("6"), type:ButtonType.NUMBER },
      { text: "-", fn: operatorClick("-"),type:ButtonType.OPERATOR }
    ],
    [
      { text: "1", fn: addToDisplay("1"), type:ButtonType.NUMBER },
      { text: "2", fn: addToDisplay("2"), type:ButtonType.NUMBER },
      { text: "3", fn: addToDisplay("3"), type:ButtonType.NUMBER },
      { text: "+", fn: operatorClick("+"),type:ButtonType.OPERATOR }
    ],
    [
      { text: "±", fn: plusMinusClick, type:ButtonType.OTHER },
      { text: "0", fn: addToDisplay("0"), type:ButtonType.NUMBER },
      { text: ",", fn: addToDisplay("."), type:ButtonType.OTHER },
      { text: "=", fn: equalsClick, type:ButtonType.OPERATOR }
    ]
  ]

  const docKeyDown = (event : KeyboardEvent) => {
    
    switch(event.key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        case '.':
          addToDisplay(event.key)();
          break;
      case ',':
        addToDisplay('.')();
        break;
      case '+':
      case '-':
        operatorClick(event.key)();
        break;
      case '*':
        operatorClick('×')();
        break;
      case '/':
        operatorClick('÷')();
        break;
      case '=': 
      case 'Enter':
        equalsClick();
        break;
      case 'c':
          clearDisplay();
          break;
      case 'Backspace':
        setDisplay(display.slice(0,display.length-1))
        break;
      case 's':
        storeInMemory();
        break;
      case 'l':
        popMemory();
        break;
    }
    
  }

  useEffect(()=> {
    window.addEventListener('keydown',docKeyDown);
    return () => window.removeEventListener('keydown',  docKeyDown);
  },[docKeyDown])
  const drawButtons = () => {
    return buttons.map((arr, row) => arr.map((button, col) => {
      return (
        <button key={row*4+col} className={button.type?.toString()} style={{ gridRow: row + 1 + 2, gridColumn: col + 1 }} onClick={button.fn}>{button.text}</button>
      )
    }))
  }
  
  return (
    <>
      <div className="grid">
        <div className="display">
          <div className="top">{history}</div>
          <div className="bottom">{display}</div>
        </div>
        {drawButtons()}
      </div>
    </>
  );
}

export default App;
