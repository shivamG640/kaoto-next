import {
  XmlSchema,
  XmlSchemaAll,
  XmlSchemaAny,
  XmlSchemaAllMember,
  XmlSchemaAttribute,
  XmlSchemaAttributeGroup,
  XmlSchemaAttributeGroupMember,
  XmlSchemaAttributeGroupRef,
  XmlSchemaAttributeOrGroupRef,
  XmlSchemaChoice,
  XmlSchemaChoiceMember,
  XmlSchemaCollection,
  XmlSchemaComplexType,
  XmlSchemaElement,
  XmlSchemaGroup,
  XmlSchemaGroupParticle,
  XmlSchemaGroupRef,
  XmlSchemaObjectBase,
  XmlSchemaParticle,
  XmlSchemaRef,
  XmlSchemaSequence,
  XmlSchemaSequenceMember,
  XmlSchemaSimpleType,
} from '@datamapper-poc/xml-schema-ts';
import { BaseDocument, BaseField, IDocument, DocumentType } from '../models';

export class XmlSchemaDocument extends BaseDocument {
  rootElement: XmlSchemaElement;
  fields: XmlSchemaField[] = [];
  id: string = `document-` + Math.random();

  constructor(public xmlSchema: XmlSchema) {
    super();
    if (this.xmlSchema.getElements().size == 0) {
      throw Error("There's no top level Element in the schema");
    }
    // TODO let user choose the root element from top level elements if there're multiple
    this.rootElement = XmlSchemaDocumentService.getFirstElement(this.xmlSchema);
    XmlSchemaDocumentService.populateElement(this, this.fields, this.rootElement);
    this.type = 'XML';
  }

  get path() {
    return `${this.id}:/`;
  }
}

type XmlSchemaParentType = XmlSchemaDocument | XmlSchemaField;

export class XmlSchemaField extends BaseField {
  fields: XmlSchemaField[] = [];
  namespaceURI: string | null = '';
  namespacePrefix: string | null = '';

  constructor(private parent: XmlSchemaParentType) {
    super();
  }

  get path(): string {
    return `${this.parent.path}/${this.id}`;
  }

  get id(): string {
    return this.isAttribute ? '@' + this.name : this.name;
  }
}

export class XmlSchemaDocumentService {
  static parseXmlSchema(content: string): XmlSchemaDocument {
    const collection = new XmlSchemaCollection();
    const xmlSchema = collection.read(content, () => {});
    return new XmlSchemaDocument(xmlSchema);
  }

  static populateXmlSchemaDocument(documents: IDocument[], type: DocumentType, name: string, content: string) {
    const doc = XmlSchemaDocumentService.parseXmlSchema(content);
    doc.name = name;
    doc.id = type + ':' + name;
    const sameNameDocs = documents.filter((d) => d.name === name);
    for (let sequence = 0; sameNameDocs.length > 0; sequence++) {
      const candidateId = `${name}.${sequence}`;
      if (!sameNameDocs.find((d) => d.id === candidateId)) {
        doc.id = candidateId;
        break;
      }
    }
    documents.push(doc);
  }

  static getFirstElement(xmlSchema: XmlSchema) {
    return xmlSchema.getElements().values().next().value;
  }

  /**
   * @deprecated
   */
  static throwNotYetSupported(object: XmlSchemaObjectBase) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const cache: any[] = [];
    throw Error(
      `Not yet supported: ${JSON.stringify(object, (_key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.includes(value)) return;
          cache.push(value);
        }
        if (typeof value === 'bigint') return value.toString();
      })}`,
    );
  }

  static populateElement(parent: XmlSchemaParentType, fields: XmlSchemaField[], element: XmlSchemaElement) {
    const field: XmlSchemaField = new XmlSchemaField(parent);
    field.name = element.getWireName()!.getLocalPart()!;
    field.namespaceURI = element.getWireName()!.getNamespaceURI();
    field.namespacePrefix = element.getWireName()!.getPrefix();
    fields.push(field);

    const schemaType = element.getSchemaType();
    if (schemaType == null) {
      field.type = element.getSchemaTypeName()?.getLocalPart() || 'string';
      return;
    }
    field.type = 'container';
    if (schemaType instanceof XmlSchemaSimpleType) {
      XmlSchemaDocumentService.throwNotYetSupported(element);
    } else if (schemaType instanceof XmlSchemaComplexType) {
      const complex = schemaType as XmlSchemaComplexType;
      const attributes: XmlSchemaAttributeOrGroupRef[] = complex.getAttributes();
      attributes.forEach((attr) => {
        XmlSchemaDocumentService.populateAttributeOrGroupRef(field, field.fields, attr);
      });
      XmlSchemaDocumentService.populateParticle(field, field.fields, complex.getParticle());
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(element);
    }
  }

  static populateAttributeOrGroupRef(
    parent: XmlSchemaParentType,
    fields: XmlSchemaField[],
    attr: XmlSchemaAttributeOrGroupRef,
  ) {
    if (attr instanceof XmlSchemaAttribute) {
      XmlSchemaDocumentService.populateAttribute(parent, fields, attr);
    } else if (attr instanceof XmlSchemaAttributeGroupRef) {
      XmlSchemaDocumentService.populateAttributeGroupRef(parent, fields, attr);
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(attr);
    }
  }

  static populateAttribute(parent: XmlSchemaParentType, fields: XmlSchemaField[], attr: XmlSchemaAttribute) {
    const field = new XmlSchemaField(parent);
    field.isAttribute = true;
    field.name = attr.getWireName()!.getLocalPart()!;
    field.namespaceURI = attr.getWireName()!.getNamespaceURI();
    field.namespacePrefix = attr.getWireName()!.getPrefix();
    fields.push(field);
  }

  static populateAttributeGroupRef(
    parent: XmlSchemaParentType,
    fields: XmlSchemaField[],
    groupRef: XmlSchemaAttributeGroupRef,
  ) {
    const ref: XmlSchemaRef<XmlSchemaAttributeGroup> = groupRef.getRef();
    XmlSchemaDocumentService.populateAttributeGroup(parent, fields, ref.getTarget());
  }

  static populateAttributeGroupMember(
    parent: XmlSchemaParentType,
    fields: XmlSchemaField[],
    member: XmlSchemaAttributeGroupMember,
  ) {
    if (member instanceof XmlSchemaAttribute) {
      XmlSchemaDocumentService.populateAttribute(parent, fields, member);
    } else if (member instanceof XmlSchemaAttributeGroup) {
      XmlSchemaDocumentService.populateAttributeGroup(parent, fields, member);
    } else if (member instanceof XmlSchemaAttributeGroupRef) {
      XmlSchemaDocumentService.populateAttributeGroupRef(parent, fields, member);
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(member);
    }
  }

  static populateAttributeGroup(
    parent: XmlSchemaParentType,
    fields: XmlSchemaField[],
    group: XmlSchemaAttributeGroup | null,
  ) {
    if (group == null) {
      return;
    }
    group
      .getAttributes()
      .forEach((member: XmlSchemaAttributeGroupMember) =>
        XmlSchemaDocumentService.populateAttributeGroupMember(parent, fields, member),
      );
  }

  static populateParticle(parent: XmlSchemaParentType, fields: XmlSchemaField[], particle: XmlSchemaParticle | null) {
    if (particle == null) {
      return;
    }
    if (particle instanceof XmlSchemaAny) {
      XmlSchemaDocumentService.populateAny(fields, particle);
    } else if (particle instanceof XmlSchemaElement) {
      XmlSchemaDocumentService.populateElement(parent, fields, particle);
    } else if (particle instanceof XmlSchemaGroupParticle) {
      XmlSchemaDocumentService.populateGroupParticle(parent, fields, particle);
    } else if (particle instanceof XmlSchemaGroupRef) {
      XmlSchemaDocumentService.populateGroupRef(fields, particle);
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(particle);
    }
  }

  static populateAny(_fields: XmlSchemaField[], schemaAny: XmlSchemaAny) {
    /* TODO - xs:any allows arbitrary elements */
    XmlSchemaDocumentService.throwNotYetSupported(schemaAny);
  }

  static populateGroupParticle(
    parent: XmlSchemaParentType,
    fields: XmlSchemaField[],
    groupParticle: XmlSchemaGroupParticle | null,
  ) {
    if (groupParticle == null) {
      return;
    }
    if (groupParticle instanceof XmlSchemaChoice) {
      const choice = groupParticle as XmlSchemaChoice;
      choice
        .getItems()
        .forEach((member: XmlSchemaChoiceMember) =>
          XmlSchemaDocumentService.populateChoiceMember(parent, fields, member),
        );
    } else if (groupParticle instanceof XmlSchemaSequence) {
      const sequence = groupParticle as XmlSchemaSequence;
      sequence
        .getItems()
        .forEach((member: XmlSchemaSequenceMember) =>
          XmlSchemaDocumentService.populateSequenceMember(parent, fields, member),
        );
    } else if (groupParticle instanceof XmlSchemaAll) {
      const all = groupParticle as XmlSchemaAll;
      all
        .getItems()
        .forEach((member: XmlSchemaAllMember) => XmlSchemaDocumentService.populateAllMember(parent, fields, member));
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(groupParticle);
    }
  }

  static populateGroupRef(_fields: XmlSchemaField[], groupRef: XmlSchemaGroupRef) {
    XmlSchemaDocumentService.throwNotYetSupported(groupRef);
  }

  static populateChoiceMember(parent: XmlSchemaParentType, fields: XmlSchemaField[], member: XmlSchemaChoiceMember) {
    if (member instanceof XmlSchemaParticle) {
      XmlSchemaDocumentService.populateParticle(parent, fields, member);
    } else if (member instanceof XmlSchemaGroup) {
      XmlSchemaDocumentService.populateGroup(parent, fields, member);
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(member);
    }
  }

  static populateSequenceMember(
    parent: XmlSchemaParentType,
    fields: XmlSchemaField[],
    member: XmlSchemaSequenceMember,
  ) {
    if (member instanceof XmlSchemaParticle) {
      XmlSchemaDocumentService.populateParticle(parent, fields, member);
    } else if (member instanceof XmlSchemaGroup) {
      XmlSchemaDocumentService.populateGroup(parent, fields, member);
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(member);
    }
  }

  static populateAllMember(parent: XmlSchemaParentType, fields: XmlSchemaField[], member: XmlSchemaAllMember) {
    if (member instanceof XmlSchemaParticle) {
      XmlSchemaDocumentService.populateParticle(parent, fields, member);
    } else if (member instanceof XmlSchemaGroup) {
      XmlSchemaDocumentService.populateGroup(parent, fields, member);
    } else {
      XmlSchemaDocumentService.throwNotYetSupported(member);
    }
  }

  static populateGroup(parent: XmlSchemaParentType, fields: XmlSchemaField[], group: XmlSchemaGroup) {
    XmlSchemaDocumentService.populateParticle(parent, fields, group.getParticle());
  }
}
