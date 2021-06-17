import { useEffect, useState } from 'react';
import './App.css';

interface Equation {
  lhs?: string;
  op?: string
  rhs: string;
}
enum ButtonType {
  OPERATOR = 'operator',
  NUMBER = 'number',
  OTHER = 'other'
}
export default function App() {
  const [equation, setEquation] = useState<Equation>({ rhs: "0" });
  const [override, setOverride] = useState(true);
  const [id, setId] = useState("");

  /**
   * Evaluates the equation based on the display and the equation state
   * @returns the result of the equation
   */
  const evalDisplay = () => {
    if (override) return;
    const { lhs, rhs, op } = equation;
    let result = 0;
    if (lhs !== undefined && rhs !== undefined && op !== undefined) {
      const left = Number.parseFloat(lhs);
      const right = Number.parseFloat(rhs);
      switch (equation.op) {
        case '+':
          result = left + right;
          break;
        case '-':
          result = left - right;
          break;
        case '×':
          result = left * right;
          break;
        case '÷':
          if (right !== 0) {
            result = left / right;
          } else {
            setEquation({ rhs: "Nem lehet 0-val osztani" });
            setOverride(true);
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
    if (!id) return;

    const get = async () => {
      const body = { id };
      let resp = await fetch('/api/pop', {
        method: 'Post', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(body)
      });
      let json = await resp.json();
      if (resp.status === 200) return json;
    }
    get().then(json => {
      if (json !== undefined) {
        setEquation(e => { return { ...e, rhs: json.number.toString() } });
        setId(json.id);
      }
    }).catch(_ => setId(''));
  }
  /**
   * Handler for the memory storing of the calculator.
   * Sends your a POST request to the /api/store endpoint, and receives the id used to fetch the number.
   */
  const storeInMemoryClick = () => {
    const post = async () => {
      const body = { number: equation.rhs, id: id };
      let resp = await fetch('/api/store', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const json = await resp.json();
      if (json.id) setId(json.id);
    }
    post();
  }
  /**
   * Handles when the , button is clicked. Doesn't add a comma to the display if there is already one there.
   */
  const commaClick = () => {
    const rhs = equation.rhs;
    if (rhs[rhs.length - 1] !== '.') {
      addToDisplayClickFor('.')();
    }
  }
  /**
   * Handles the ± button. Inverts the sign of the displayed number.
   */
  const plusMinusClick = () => {
    if (equation.rhs.startsWith('-')) {
      if (equation.rhs.length > 1) {
        const rhs = equation.rhs.substr(1);
        setEquation(e => { return { ...e, rhs } });
      } else {
        setEquation(e => { return { ...e, rhs: "0" } });
      }
    } else {
      if (equation.rhs === '0') {
        setEquation(e => { return { ...e, rhs: "-" } });
      } else {
        const rhs = '-' + equation.rhs;
        setEquation(e => { return { ...e, rhs } });
      }
    }
  }
  /**
   * Handles the C button. On first call clears the bottom part, and on the second call clears top too.
   */
  const clearDisplayClick = () => {
    if (equation.rhs === "0") {
      setEquation({ rhs: equation.rhs });
    } else {
      setEquation(e => { return { ...e, rhs: "0" } });
    }
  }
  /**
   * Handles the = button. Evaluates the expression on the display if possible.
   * @returns if no value was supplied
   */
  const equalsClick = () => {
    if (equation.rhs === '') return;
    const result = evalDisplay();
    if (result !== undefined) {
      const rhs = result.toString();
      setEquation({ rhs });
    }
  }
  const backSpacePress = () => {
    const rhs = equation.rhs;
    setEquation(e => { return { ...e, rhs: rhs.slice(0, rhs.length - 1) } });
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
      if (override || equation.rhs === '0') {
        setEquation(e => { return { ...e, rhs: label } });
        setOverride(false);
      } else {
        setEquation(e => { return { ...e, rhs: equation.rhs + label } });
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
      if (equation.rhs === '') return;
      if (!override) {
        if (!equation.lhs) {
          setEquation({ lhs: equation.rhs, rhs: "0", op })
        } else {
          const lhs = evalDisplay()?.toString();
          if (lhs) setEquation({ lhs, op, rhs: "0" });
        }
      }
    }
  }


  const buttons = [
    [
      { text: "MR", fn: popMemoryClick, type: ButtonType.OTHER },
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
      { text: ",", fn: commaClick, type: ButtonType.OTHER },
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
        addToDisplayClickFor(event.key)();
        break;
      case '.':
      case ',':
        commaClick();
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
        backSpacePress();
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
  }, [handleKeyDown])
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
          <div className="top">{equation.lhs && equation.op && equation.lhs + equation.op}</div>
          <div className="bottom">{equation.rhs}</div>
        </div>
        {drawButtons()}
      </div>
    </>
  );
}

