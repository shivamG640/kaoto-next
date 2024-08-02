import { FunctionComponent, PropsWithChildren, createContext, useState } from 'react';
import { FormTabsModes } from '../components/Visualization/Canvas';

export interface CanvasFormTabsContextResult {
  selectedTab: FormTabsModes;
  onTabChange: (_event: unknown, _isSelected: boolean) => void;
}
export const CanvasFormTabsContext = createContext<CanvasFormTabsContextResult>({
  selectedTab: FormTabsModes.REQUIRED_FIELDS,
  onTabChange: () => {},
});

/**
 * Used for fetching and injecting the selected tab information from the canvas form
 */
export const CanvasFormTabsProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const [tab, setTab] = useState<FormTabsModes>(FormTabsModes.REQUIRED_FIELDS);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTabChange = (event: any, _isSelected: boolean) => {
    const id = event.currentTarget.id;
    setTab(id);
  };

  return (
    <CanvasFormTabsContext.Provider
      value={{
        selectedTab: tab,
        onTabChange,
      }}
    >
      {props.children}
    </CanvasFormTabsContext.Provider>
  );
};
