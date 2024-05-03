import { TrashIcon } from '@patternfly/react-icons';
import { ContextMenuItem } from '@patternfly/react-topology';
import { FunctionComponent, PropsWithChildren, useCallback, useContext } from 'react';
import { IDataTestID } from '../../../models';
import { IVisualizationNode } from '../../../models/visualization/base-visual-entity';
import { EntitiesContext } from '../../../providers/entities.provider';
import { DeleteModalContext } from '../../../providers/delete-modal.provider';

interface ItemDeleteGroupProps extends PropsWithChildren<IDataTestID> {
  vizNode: IVisualizationNode;
}

export const ItemDeleteGroup: FunctionComponent<ItemDeleteGroupProps> = (props) => {
  const entitiesContext = useContext(EntitiesContext);
  const deleteModalContext = useContext(DeleteModalContext);
  const flowId = props.vizNode?.getBaseEntity()?.getId();

  const onRemoveGroup = useCallback(async () => {
    /** Open delete confirm modal, get the confirmation  */
    const isDeleteConfirmed = await deleteModalContext?.deleteConfirmation();

    if (!isDeleteConfirmed) return;

    entitiesContext?.camelResource.removeEntity(flowId);
    entitiesContext?.updateEntitiesFromCamelResource();
  }, [entitiesContext, flowId]);

  return (
    <ContextMenuItem onClick={onRemoveGroup} data-testid={props['data-testid']}>
      <TrashIcon /> Delete
    </ContextMenuItem>
  );
};
