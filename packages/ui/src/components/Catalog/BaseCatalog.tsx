import { DataList, Gallery, Pagination } from '@patternfly/react-core';
import { FunctionComponent, useCallback, useState } from 'react';
import './BaseCatalog.scss';
import { CatalogLayout, ITile } from './Catalog.models';
import { CatalogDataListItem } from './DataListItem';
import { Tile } from './Tile';

interface BaseCatalogProps {
  className?: string;
  tiles: ITile[];
  catalogLayout: CatalogLayout;
  onTileClick?: (tile: ITile) => void;
  onTagClick: (_event: unknown, value: string) => void;
}

export const BaseCatalog: FunctionComponent<BaseCatalogProps> = (props) => {
  const itemCount = props.tiles?.length;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const onTileClick = useCallback(
    (tile: ITile) => {
      props.onTileClick?.(tile);
    },
    [props],
  );

  const onSelectDataListItem = useCallback(
    (_event: React.MouseEvent | React.KeyboardEvent, id: string) => {
      const tile = props.tiles.find((tile) => tile.name + '-' + tile.type === id);
      onTileClick(tile!);
    },
    [onTileClick, props.tiles],
  );

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number,
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const paginatedCards = props.tiles?.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={page}
        onSetPage={onSetPage}
        widgetId="top-example"
        onPerPageSelect={onPerPageSelect}
        ouiaId="PaginationTop"
      />
      <div id="catalog-list" className="catalog-list">
        {props.catalogLayout == CatalogLayout.List && (
          <DataList aria-label="Catalog list" onSelectDataListItem={onSelectDataListItem} isCompact>
            {paginatedCards.map((tile) => (
              <CatalogDataListItem key={`${tile.name}-${tile.type}`} tile={tile} onTagClick={props.onTagClick} />
            ))}
          </DataList>
        )}
        {props.catalogLayout == CatalogLayout.Gallery && (
          <Gallery hasGutter>
            {paginatedCards.map((tile) => (
              <Tile key={`${tile.name}-${tile.type}`} tile={tile} onClick={onTileClick} onTagClick={props.onTagClick} />
            ))}
          </Gallery>
        )}
      </div>
    </>
  );
};
