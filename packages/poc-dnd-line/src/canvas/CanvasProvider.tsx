import {
  createContext,
  FunctionComponent,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  DataRef,
  DndContext,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDndMonitor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Label } from '@patternfly/react-core';

const DnDMonitor: FunctionComponent = () => {
  useDndMonitor({
    onDragStart(event) {
      console.log(`onDragStart: [active: ${JSON.stringify(event.active?.data.current)}`);
    },
    onDragEnd(event) {
      console.log(
        `onDragEnd: [active: ${JSON.stringify(event.active?.data.current)}, over:${JSON.stringify(event.over?.data.current)}`,
      );
    },
    onDragCancel(event) {
      console.log(
        `onDragCancel: active: ${JSON.stringify(event.active?.data.current)}, over:${JSON.stringify(event.over?.data.current)}`,
      );
    },
  });
  return <></>;
};

export interface ICanvasContext {
  setFieldReference: (path: string, ref: MutableRefObject<HTMLDivElement>) => void;
  getFieldReference: (path: string) => MutableRefObject<HTMLDivElement>;
  getAllFieldPaths: () => string[];
  reloadFieldReferences: () => void;
}

export const CanvasContext = createContext<ICanvasContext | undefined>(undefined);

export const CanvasProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [activeData, setActiveData] = useState<DataRef<Record<string, any>>>(null);
  const [fieldReferenceMap, setFieldReferenceMap] = useState<Map<string, MutableRefObject<HTMLDivElement>>>(
    new Map<string, MutableRefObject<HTMLDivElement>>(),
  );
  const [parentPathMap, setParentPathMap] = useState<Map<string, string>>(new Map<string, string>());

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveData(event.active.data);
  }, []);

  const handleDragEnd = useCallback(() => {
    setActiveData(null);
  }, []);

  const setFieldReference = useCallback(
    (path: string, ref: MutableRefObject<HTMLDivElement>) => {
      fieldReferenceMap.set(path, ref);
    },
    [fieldReferenceMap],
  );

  const getFieldReference = useCallback(
    (path: string) => {
      return fieldReferenceMap.get(path);
    },
    [fieldReferenceMap],
  );

  const getAllFieldPaths = useCallback(() => {
    return Array.from(fieldReferenceMap.keys());
  }, [fieldReferenceMap]);

  const reloadFieldReferences = useCallback(() => {
    setFieldReferenceMap(new Map(fieldReferenceMap));
  }, [fieldReferenceMap]);

  const value = useMemo(() => {
    return {
      setFieldReference,
      getFieldReference,
      getAllFieldPaths,
      reloadFieldReferences,
    };
  }, [setFieldReference, getFieldReference, getAllFieldPaths, reloadFieldReferences]);

  return (
    <CanvasContext.Provider value={value}>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DnDMonitor></DnDMonitor>
        {props.children}
        <DragOverlay dropAnimation={null}>
          <Label>{activeData?.current ? activeData.current.name : null}</Label>
        </DragOverlay>
      </DndContext>
    </CanvasContext.Provider>
  );
};
