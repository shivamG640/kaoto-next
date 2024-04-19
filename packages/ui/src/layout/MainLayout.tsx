/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { FunctionComponent, memo, useCallback, useContext, useMemo, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Masthead,
  MastheadContent,
  Page,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import { MappingDetailsDrawerPanel, SourceTargetView } from './views';
import { DataMapperContext } from '../providers';
import { CanvasView } from '../models';
import { ContextToolbar } from './ContextToolbar';
import { useDataMapper } from '../hooks';
import './MainLayout.scss';
import { useCanvas } from '../hooks/useCanvas';

export interface IMainLayoutProps {
  showSidebar: boolean;
}

export const MainLayout: FunctionComponent<IMainLayoutProps> = memo(function MainLayout() {
  const { selectedMapping } = useDataMapper();
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const { reloadNodeReferences } = useCanvas();

  const { activeView } = useContext(DataMapperContext)!;
  const currentView = useMemo(() => {
    switch (activeView) {
      case CanvasView.SOURCE_TARGET:
        return <SourceTargetView isSourceOnly={isEditMode} />;
      default:
        return <>View {activeView} is not supported</>;
    }
  }, [activeView, isEditMode]);

  const handleToggleEditMode = useCallback(
    (isEditMode: boolean) => {
      setEditMode(isEditMode);
      setTimeout(() => reloadNodeReferences(), 200);
    },
    [reloadNodeReferences],
  );

  const header = (
    <Masthead>
      <MastheadContent>
        <ContextToolbar />
      </MastheadContent>
    </Masthead>
  );

  return (
    <Page header={header}>
      <PageSection variant={PageSectionVariants.default} className="main-layout">
        <Drawer isExpanded={!!selectedMapping} isInline>
          <DrawerContent
            panelContent={<MappingDetailsDrawerPanel onToggleEditMode={handleToggleEditMode} />}
            className="main-layout__drawer-content"
          >
            <DrawerContentBody className="main-layout__drawer-content-body">{currentView}</DrawerContentBody>
          </DrawerContent>
        </Drawer>
      </PageSection>
    </Page>
  );
});
