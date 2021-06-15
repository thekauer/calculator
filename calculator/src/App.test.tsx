import { render, screen } from '@testing-library/react';
import App from './App';

describe('test layout', () => {
  it('tests if layout is rendered properly', () => {
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
  it('tests if leading zeros are removed', () => {
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

describe('test addition', () => {
  it('1+1', () => {
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
  it('1+0', () => {
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

})

describe('substraction', () => {
  it('1-2-1', () => {
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
})

