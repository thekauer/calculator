import { useEffect, useState } from 'react';
import './App.css';

interface Equation {
  lhs?:number;
  op?:string
}

function App() {
  const [history,setHistory] = useState("");
  const [display,setDisplay] = useState("0");
  const [equation,setEquation] = useState<Equation>({});
  const [override,setOverride] = useState(true);
  const peekMemory = () => {

  }
  const storeInMemory = () => {

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
      if(override) {
        setDisplay(s);
        setOverride(false);
      } else {
        setDisplay(display + s);
      }
    }
  }
  const operatorClick = (op : string) => {
    return () => {
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
    const result = evalDisplay();
    if(result) {
      setDisplay(result.toString());
      setEquation({});
    }
  }

  const buttons = [
    [
      { text: "M-", fn: peekMemory },
      { text: "M+", fn: storeInMemory },
      { text: "C", fn: clearDisplay },
      { text: "÷", fn: operatorClick("÷") }
    ],
    [
      { text: "7", fn: addToDisplay("7") },
      { text: "8", fn: addToDisplay("8") },
      { text: "9", fn: addToDisplay("9") },
      { text: "×", fn: operatorClick("×") }
    ],
    [
      { text: "4", fn: addToDisplay("4") },
      { text: "5", fn: addToDisplay("5") },
      { text: "6", fn: addToDisplay("6") },
      { text: "-", fn: operatorClick("-") }
    ],
    [
      { text: "1", fn: addToDisplay("1") },
      { text: "2", fn: addToDisplay("2") },
      { text: "3", fn: addToDisplay("3") },
      { text: "+", fn: operatorClick("+") }
    ],
    [
      { text: "±", fn: () => {} },
      { text: "0", fn: addToDisplay("0") },
      { text: ",", fn: addToDisplay(",") },
      { text: "=", fn: equalsClick }
    ]
  ]

  useEffect(()=> {
    if(display.startsWith("0") && display.length > 1) {
      setDisplay(display.substr(1));
    }
  }, [display])

  const drawButtons = () => {
    return buttons.map((arr, row) => arr.map((button, col) => {
      return (
        <button key={row*4+col} style={{ gridRow: row + 1 + 2, gridColumn: col + 1 }} onClick={button.fn}>{button.text}</button>
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
