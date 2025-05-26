import Counter from '@/components/Counter';
import { fireEvent, render } from '@testing-library/react-native';

describe('Counter', () => {
  it('should display initial count of zero', () => {
    const { getByTestId } = render(<Counter />);
    expect(getByTestId('counter-value').props.children).toBe(0);
  });

  it('should increment count when increment button is pressed', () => {
    const { getByTestId } = render(<Counter />);
    const incrementButton = getByTestId('increment-button');
    
    fireEvent.press(incrementButton);
    
    expect(getByTestId('counter-value').props.children).toBe(1);
  });
});