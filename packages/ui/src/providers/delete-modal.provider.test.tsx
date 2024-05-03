import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { DeleteModalContextProvider, DeleteModalContext } from './delete-modal.provider';

let deleteConfirmationResult: boolean | undefined;

describe('DeleteModalProvider', () => {
  it('calls deleteConfirmation with true when Confirm button is clicked', async () => {
    render(
      <DeleteModalContextProvider>
        <TestComponent />
      </DeleteModalContextProvider>,
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: 'Confirm' });
    fireEvent.click(confirmButton);

    // Wait for deleteConfirmation promise to resolve
    await waitFor(() => expect(deleteConfirmationResult).toEqual(true));
  });

  it('calls deleteConfirmation with false when Cancel button is clicked', async () => {
    render(
      <DeleteModalContextProvider>
        <TestComponent />
      </DeleteModalContextProvider>,
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    // Wait for deleteConfirmation promise to resolve
    await waitFor(() => expect(deleteConfirmationResult).toEqual(false));
  });
});

const TestComponent = () => {
  const { deleteConfirmation } = useContext(DeleteModalContext)!;

  const handleDelete = async () => {
    const confirmation = await deleteConfirmation();
    deleteConfirmationResult = confirmation;
  };

  return <button onClick={handleDelete}>Delete</button>;
};
