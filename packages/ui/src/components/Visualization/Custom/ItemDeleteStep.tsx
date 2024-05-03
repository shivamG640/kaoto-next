import { TrashIcon } from '@patternfly/react-icons';
import { ContextMenuItem } from '@patternfly/react-topology';
import { FunctionComponent, PropsWithChildren, useCallback, useContext } from 'react';
import { IDataTestID } from '../../../models';
import { IVisualizationNode } from '../../../models/visualization/base-visual-entity';
import { EntitiesContext } from '../../../providers/entities.provider';
import { DeleteModalContext } from '../../../providers/delete-modal.provider';

interface ItemDeleteStepProps extends PropsWithChildren<IDataTestID> {
  vizNode: IVisualizationNode;
  loadModal: boolean;
}

export const ItemDeleteStep: FunctionComponent<ItemDeleteStepProps> = (props) => {
  const entitiesContext = useContext(EntitiesContext);
  const deleteModalContext = useContext(DeleteModalContext);

  const onRemoveNode = useCallback(async () => {
    if (props.loadModal) {
      /** Open delete confirm modal, get the confirmation  */
      const isDeleteConfirmed = await deleteModalContext?.deleteConfirmation();

      if (!isDeleteConfirmed) return;
    }

    props.vizNode?.removeChild();
    entitiesContext?.updateEntitiesFromCamelResource();
  }, [entitiesContext, props.vizNode]);

  return (
    <ContextMenuItem onClick={onRemoveNode} data-testid={props['data-testid']}>
      <TrashIcon /> Delete
    </ContextMenuItem>
  );
};
