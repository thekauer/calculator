import { render, screen } from '@testing-library/react';
import App from './App';

describe('test layout', () => {
  test('tests if layout is rendered properly', () => {
    const { container } = render(<App />);
    const grid = container.getElementsByClassName('grid');
    expect(grid.length).toBe(1);
    const buttons = container.getElementsByTagName('button');
    expect(buttons.length).toBe(20);
    const display = container.getElementsByClassName('display');
    expect(display.length).toBe(1);
    const top = container.getElementsByClassName('top');
    expect(top.length).toBe(1);
    const bottom = container.getElementsByClassName('bottom');
    expect(bottom.length).toBe(1);
  })
  test('tests if leading zeros are removed', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    expect(top.innerHTML).toBe("");
    expect(bottom.innerHTML).toBe("0");
    const zero = getAllByText(/0/).filter(elem => elem.tagName === 'BUTTON')[0];
    zero.click();
    expect(bottom.innerHTML).toBe("0");
    const one = getByText(/1/);
    one.click();
    expect(bottom.innerHTML).toBe("1");

  })
})

describe('test operations', () => {
  test('1+1', () => {
    const { container, getByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const add = getByText(/^\+$/);
    const eq = getByText(/=/);
    one.click();
    expect(bottom.innerHTML).toBe('1');
    add.click();
    expect(bottom.innerHTML).toBe('0');
    expect(top.innerHTML).toBe('1+');
    one.click();
    expect(top.innerHTML).toBe('1+');
    expect(bottom.innerHTML).toBe('1');
    eq.click();
    expect(top.innerHTML).toBe(" ");
    expect(bottom.innerHTML).toBe('2');
  })
  test('1+0', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const add = getByText(/^\+$/);
    const eq = getByText(/=/);
    one.click();
    expect(bottom.innerHTML).toBe('1');
    add.click();
    expect(bottom.innerHTML).toBe('0');
    expect(top.innerHTML).toBe('1+');
    eq.click();
    expect(bottom.innerHTML).toBe('1');
  })
  test('0+1', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const add = getByText(/^\+$/);
    const eq = getByText(/=/);
    add.click();
    expect(bottom.innerHTML).toBe('0');
    one.click();
    expect(bottom.innerHTML).toBe('1');
    eq.click();
    expect(bottom.innerHTML).toBe('1');
  })
  test('1-2-1', () => {
    const { container, getByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const sub = getByText(/^-$/);
    const two = getByText(/2/);
    const eq = getByText(/=/);
    one.click();
    expect(bottom.innerHTML).toBe('1');
    sub.click();
    expect(bottom.innerHTML).toBe('0');
    expect(top.innerHTML).toBe('1-');
    two.click();
    expect(top.innerHTML).toBe('1-');
    expect(bottom.innerHTML).toBe('2');
    eq.click();
    expect(top.innerHTML).toBe(" ");
    expect(bottom.innerHTML).toBe('-1');
    sub.click();
    one.click();
    eq.click();
    expect(top.innerHTML).toBe(" ");
    expect(bottom.innerHTML).toBe('-2');

  })
  test('2*3/2/0 3', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    const zero = container.querySelector<HTMLButtonElement>('#button18');
    const two = getByText(/2/);
    const three = getByText(/3/);
    const mul = getByText(/×/);
    const div = getByText(/÷/);
    const eq = getByText(/=/);
    expect(zero).not.toBeNull();

    two.click();
    mul.click();
    three.click();
    eq.click();
    expect(bottom.innerHTML).toBe('6');
    expect(top.innerHTML).toBe(' ');
    div.click();
    two.click();
    eq.click();
    expect(bottom.innerHTML).toBe('3');
    div.click();
    zero?.click();
    eq.click();
    expect(bottom.innerHTML).toBe("Nem lehet 0-val osztani");
    expect(top.innerHTML).toBe(' ');
    three.click();
    expect(bottom.innerHTML).toBe('3');
    expect(top.innerHTML).toBe(' ');

  })
  test('1.5*2', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const two = getByText(/2/);
    const five = getByText(/5/);
    const mul = getByText(/×/);
    const comma = getByText(/,/);
    const eq = getByText(/=/);

    one.click();
    comma.click();
    comma.click();
    five.click();
    expect(bottom.innerHTML).toBe('1.5');
    mul.click();
    two.click();
    eq.click();
    expect(bottom.innerHTML).toBe('3');
  })
  test('1 C 1+2 C C', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const two = getByText(/2/);
    const C = getByText(/C/);
    const add = getByText(/^\+$/);

    one.click();

    expect(bottom.innerHTML).toBe('1');

    C.click();

    expect(bottom.innerHTML).toBe('0');

    one.click();
    add.click()
    two.click();

    expect(bottom.innerHTML).toBe('2');

    C.click();

    expect(bottom.innerHTML).toBe('0');

    C.click()

    expect(top.innerHTML).toBe(' ');

  })
  test('± 12 C ± ± 12 ± 3 ±', () => {
    const { container, getByText, getAllByText } = render(<App />);
    const top = container.getElementsByClassName('top')[0];
    const bottom = container.getElementsByClassName('bottom')[0];
    const one = getByText(/1/);
    const two = getByText(/2/);
    const three = getByText(/3/);
    const pm = getByText(/±/);
    const C = getByText(/C/);

    pm.click();
    expect(bottom.innerHTML).toBe('-');
    one.click();
    C.click();
    expect(bottom.innerHTML).toBe('0');
    pm.click();
    expect(bottom.innerHTML).toBe('-');
    pm.click();
    expect(bottom.innerHTML).toBe('0');
    one.click();
    expect(bottom.innerHTML).toBe('1');
    two.click();
    expect(bottom.innerHTML).toBe('12');
    pm.click();
    expect(bottom.innerHTML).toBe('-12');
    three.click();
    expect(bottom.innerHTML).toBe('-123');
    pm.click();
    expect(bottom.innerHTML).toBe('123');

  })
})

