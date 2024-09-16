import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FunctionComponent, useContext } from 'react';
import { ActionModalContext, ActionModalContextProvider } from './action-modal.provider';

let actionConfirmationResult: boolean | undefined;

describe('ActionModalProvider', () => {
  beforeEach(() => {
    actionConfirmationResult = undefined;
  });

  it('calls actionConfirmation with true when Confirm button is clicked', async () => {
    render(
      <ActionModalContextProvider>
        <TestComponent title="Permanently delete step" text="Step parameters and its children will be lost." />
      </ActionModalContextProvider>,
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: 'Confirm' });
    fireEvent.click(confirmButton);

    // Wait for actionConfirmation promise to resolve
    await waitFor(() => expect(actionConfirmationResult).toEqual(true));
  });

  it('calls actionConfirmation with false when Cancel button is clicked', async () => {
    render(
      <ActionModalContextProvider>
        <TestComponent title="Permanently delete step" text="Step parameters and its children will be lost." />
      </ActionModalContextProvider>,
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    // Wait for actionConfirmation promise to resolve
    await waitFor(() => expect(actionConfirmationResult).toEqual(false));
  });

  it('should allow consumers to update the modal title and text', () => {
    const wrapper = render(
      <ActionModalContextProvider>
        <TestComponent title="Custom title" text="Custom text" />
      </ActionModalContextProvider>,
    );

    act(() => {
      const deleteButton = wrapper.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    const modalDialog = wrapper.getByRole('dialog');
    expect(modalDialog).toMatchSnapshot();

    expect(wrapper.queryByText('Custom title')).toBeInTheDocument;
    expect(wrapper.queryByText('Custom text')).toBeInTheDocument;
  });
});

const TestComponent: FunctionComponent<{ title: string; text: string }> = (props) => {
  const { actionConfirmation: deleteConfirmation } = useContext(ActionModalContext)!;

  const handleDelete = async () => {
    const confirmation = await deleteConfirmation(props);
    actionConfirmationResult = confirmation;
  };

  return <button onClick={handleDelete}>Delete</button>;
};
