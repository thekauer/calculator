import { useEffect, useState } from 'react';
import './App.css';

interface Equation {
  lhs?: number;
  op?: string
}
enum ButtonType {
  OPERATOR = 'operator',
  NUMBER = 'number',
  OTHER = 'other'
}
function App() {
  const [history, setHistory] = useState("");
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState<Equation>({});
  const [override, setOverride] = useState(true);
  const [id, setId] = useState("");

/**
 * Evaluates the equation based on the display and the equation state
 * @returns the result of the equation
 */
  const evalDisplay = () => {
    if (override) return;
    const rhs = Number.parseFloat(display);
    let result = 0;
    if (equation.op && equation.lhs !== undefined) {
      setHistory(" ");
      switch (equation.op) {
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
          if (rhs !== 0) {
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
  /**
   * Handler for the memory fetching of the calculator.
   * Sends your id to the server through a POST request to the /api/pop endpoint, and receives the stored number.
   */
  const popMemoryClick = () => {
    const get = async () => {
      let resp = await fetch('/api/pop',{method:'Post',body:id});
      let text = await resp.text();
      if (resp.status === 200) {
        return text;
      }
    }
    get().then(text => {if(text)setDisplay(text);});
  }
  /**
   * Handler for the memory storing of the calculator.
   * Sends your a POST request to the /api/store endpoint, and receives the id used to fetch the number.
   */
  const storeInMemoryClick = () => {
    const post = async () => {
      let resp = await fetch('/api/store', { method: 'POST', body: display.toString() });
      let text = await resp.text();
      setId(text);

    }
    post();
  }
  /**
   * Handles the ± button. Inverts the sign of the displayed number.
   */
  const plusMinusClick = () => {
    if (display.startsWith('-')) {
      if(display.length>1) {
        setDisplay(display.substr(1));
      } else {
        setDisplay("0");
      }
    } else {
      if (display === '0') {
        setDisplay('-');
      } else {
        setDisplay(d => '-' + d);
      }
    }
  }
  /**
   * Handles the C button. On first call clears the bottom part, and on the second call clears top too.
   */
  const clearDisplayClick = () => {
    if (display === "0") {
      setHistory(" ");
      setEquation({});
    } else {
      setDisplay("0");
    }
  }
  /**
   * Handles the = button. Evaluates the expression on the display if possible.
   * @returns if no value was supplied
   */
  const equalsClick = () => {
    if (display === '') return;
    const result = evalDisplay();
    if (result !== undefined) {
      setDisplay(result.toString());
      setEquation({});
    }
  }
  /**
   * Gives you a function that appends the given label to the display
   * @param label label of the button
   * @returns a function that adds the label to the display
   * @example
   * addToDisplayClickFor('1')() // add 1 to the screen
   * @example
   * { text: "1", fn: addToDisplayClickFor("1"), type: ButtonType.NUMBER },
   */
  const addToDisplayClickFor = (label: string) => {
    return () => {
      if (override || display === '0') {
        setDisplay(label);
        setOverride(false);
      } else {
        setDisplay(d=> d + label);
      }
    }
  }
    /**
   * Gives you a function that appends the given operator and the current displayed value to the history
   * @param op operator as text for the button
   * @returns a function that adds the label to the display
   * @example
   * operatorClickFor('+')() // add the current dislayed value and the oprator to the history
   * @example
   * { text: "+", fn: operatorClickFor("+"), type: ButtonType.OPERATOR },
   */
  const operatorClickFor = (op: string) => {
    return () => {
      if (display === '') return;
      if (!override) {
        if (!equation.lhs) {
          const lhs = Number.parseFloat(display);
          setEquation({ lhs, op });
          setHistory(lhs + op)
          setDisplay("0");
        } else {
          const old = display;
          const lhs = evalDisplay();
          setEquation({ lhs, op });
          setHistory(lhs + op);
          setDisplay(old);

        }
      }
    }
  }


  const buttons = [
    [
      { text: "M-", fn: popMemoryClick, type: ButtonType.OTHER },
      { text: "M+", fn: storeInMemoryClick, type: ButtonType.OTHER },
      { text: "C", fn: clearDisplayClick, type: ButtonType.OTHER },
      { text: "÷", fn: operatorClickFor("÷"), type: ButtonType.OPERATOR }
    ],
    [
      { text: "7", fn: addToDisplayClickFor("7"), type: ButtonType.NUMBER },
      { text: "8", fn: addToDisplayClickFor("8"), type: ButtonType.NUMBER },
      { text: "9", fn: addToDisplayClickFor("9"), type: ButtonType.NUMBER },
      { text: "×", fn: operatorClickFor("×"), type: ButtonType.OPERATOR }
    ],
    [
      { text: "4", fn: addToDisplayClickFor("4"), type: ButtonType.NUMBER },
      { text: "5", fn: addToDisplayClickFor("5"), type: ButtonType.NUMBER },
      { text: "6", fn: addToDisplayClickFor("6"), type: ButtonType.NUMBER },
      { text: "-", fn: operatorClickFor("-"), type: ButtonType.OPERATOR }
    ],
    [
      { text: "1", fn: addToDisplayClickFor("1"), type: ButtonType.NUMBER },
      { text: "2", fn: addToDisplayClickFor("2"), type: ButtonType.NUMBER },
      { text: "3", fn: addToDisplayClickFor("3"), type: ButtonType.NUMBER },
      { text: "+", fn: operatorClickFor("+"), type: ButtonType.OPERATOR }
    ],
    [
      { text: "±", fn: plusMinusClick, type: ButtonType.OTHER },
      { text: "0", fn: addToDisplayClickFor("0"), type: ButtonType.NUMBER },
      { text: ",", fn: addToDisplayClickFor("."), type: ButtonType.OTHER },
      { text: "=", fn: equalsClick, type: ButtonType.OPERATOR }
    ]
  ]
/**
 * Handles the keydown event for the calculator.
 * @param event keydown event
 */
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
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
        addToDisplayClickFor(event.key)();
        break;
      case ',':
        addToDisplayClickFor('.')();
        break;
      case '+':
      case '-':
        operatorClickFor(event.key)();
        break;
      case '*':
        operatorClickFor('×')();
        break;
      case '/':
        operatorClickFor('÷')();
        break;
      case '=':
      case 'Enter':
        event.preventDefault();
        equalsClick();
        break;
      case 'Delete':
      case 'c':
        clearDisplayClick();
        break;
      case 'Backspace':
        setDisplay(display.slice(0, display.length - 1))
        break;
      case 'm':
        storeInMemoryClick();
        break;
      case 'n':
        popMemoryClick();
        break;
      case 's':
        plusMinusClick();
        break;
    }

  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  },[handleKeyDown])
  /**
   * Draws all the buttons of the calculator.
   * @returns JSX.Elements from the buttons array
   */
  const drawButtons = () => {
    return buttons.map((arr, row) => arr.map((button, col) => {
      const key = row * 4 + col;
      const id = "button" + (key + 1).toString();
      return (
        <button id={id} key={row * 4 + col} className={button.type?.toString()} style={{ gridRow: row + 1 + 2, gridColumn: col + 1 }} onClick={button.fn}>{button.text}</button>
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
