import { Types } from '../../../models/types';
import { IFunctionDefinition } from '../../../models';

/**
 * 15 Sequence - https://www.w3.org/TR/2010/REC-xpath-functions-20101214/#sequence-functions
 */
export const sequenceFunctions = [
  {
    name: 'boolean',
    displayName: 'Boolean',
    description: 'Computes the effective boolean value of the argument sequence.',
    returnType: Types.Boolean,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'index-of',
    displayName: 'Index Of',
    description:
      'Returns a sequence of xs:integers, each of which is the index of a member of the sequence specified as' +
      ' the first argument that is equal to the value of the second argument. If no members of the specified' +
      ' sequence are equal to the value of the second argument, the empty sequence is returned.',
    returnType: Types.Integer,
    returnCollection: true,
    arguments: [
      {
        name: 'seqParam',
        displayName: '$seqParam',
        description: '$seqParam',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'srchParam',
        displayName: '$srchParam',
        description: '$srchParam',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: 1,
      },
      {
        name: 'collation',
        displayName: '$collation',
        description: '$collation',
        type: Types.String,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'empty',
    displayName: 'Empty',
    description: 'Indicates whether or not the provided sequence is empty.',
    returnType: Types.Boolean,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'exists',
    displayName: 'Exists',
    description: 'Indicates whether or not the provided sequence is not empty.',
    returnType: Types.Boolean,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'distinct-values',
    displayName: 'Distinct Values',
    description:
      'Returns a sequence in which all but one of a set of duplicate values, based on value equality, have been' +
      ' deleted. The order in which the distinct values are returned is implementation dependent.',
    returnType: Types.AnyAtomicType,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'collation',
        displayName: '$collation',
        description: '$collation',
        type: Types.String,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'insert-before',
    displayName: 'Insert Before',
    description: 'Inserts an item or sequence of items at a specified position in a sequence.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'target',
        displayName: '$target',
        description: '$target',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'position',
        displayName: '$position',
        description: '$position',
        type: Types.Integer,
        minOccurs: 1,
        maxOccurs: 1,
      },
      {
        name: 'inserts',
        displayName: '$inserts',
        description: '$inserts',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'remove',
    displayName: 'Remove',
    description: 'Removes an item from a specified position in a sequence.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'target',
        displayName: '$target',
        description: '$target',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'position',
        displayName: '$position',
        description: '$position',
        type: Types.Integer,
        minOccurs: 1,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'reverse',
    displayName: 'Reverse',
    description: 'Reverses the order of items in a sequence.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'subsequence',
    displayName: 'Subsequence',
    description: 'Returns the subsequence of a given sequence, identified by location.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'sourceSeq',
        displayName: '$sourceSeq',
        description: '$sourceSeq',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'startingLoc',
        displayName: '$startingLoc',
        description: '$startingLoc',
        type: Types.Double,
        minOccurs: 1,
        maxOccurs: 1,
      },
      {
        name: 'length',
        displayName: '$length',
        description: '$length',
        type: Types.Double,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'unordered',
    displayName: 'Unordered',
    description: 'Returns the items in the given sequence in a non-deterministic order.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'sourceSeq',
        displayName: '$sourceSeq',
        description: '$sourceSeq',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'zero-or-one',
    displayName: 'Zero Or One',
    description: 'Returns the input sequence if it contains zero or one items. Raises an error otherwise.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'one-or-more',
    displayName: 'One Or More',
    description: 'Returns the input sequence if it contains one or more items. Raises an error otherwise.',
    returnType: Types.Item,
    returnCollection: true,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'exactly-one',
    displayName: 'Exactly One',
    description: 'Returns the input sequence if it contains exactly one item. Raises an error otherwise.',
    returnType: Types.Item,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'deep-equal',
    displayName: 'Deep Equal',
    description: 'Returns true if the two arguments have items that compare equal in corresponding positions.',
    returnType: Types.Boolean,
    arguments: [
      {
        name: 'parameter1',
        displayName: '$parameter1',
        description: 'parameter1',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'parameter2',
        displayName: '$parameter2',
        description: 'parameter2',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'collation',
        displayName: '$collation',
        description: 'collation',
        type: Types.String,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'count',
    displayName: 'Count',
    description: 'Returns the number of items in a sequence.',
    returnType: Types.Integer,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.Item,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'avg',
    displayName: 'Average',
    description: 'Returns the average of a sequence of values.',
    returnType: Types.AnyAtomicType,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
    ],
  },
  {
    name: 'max',
    displayName: 'Maximum',
    description: 'Returns the maximum value from a sequence of comparable values.',
    returnType: Types.AnyAtomicType,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'collation',
        displayName: '$collation',
        description: 'collation',
        type: Types.String,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'min',
    displayName: 'Minimum',
    description: 'Returns the minimum value from a sequence of comparable values.',
    returnType: Types.AnyAtomicType,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'collation',
        displayName: '$collation',
        description: 'collation',
        type: Types.String,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'sum',
    displayName: 'Sum',
    description: 'Returns the sum of a sequence of values.',
    returnType: Types.AnyAtomicType,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.AnyAtomicType,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'zero',
        displayName: '$zero',
        description: 'zero',
        type: Types.AnyAtomicType,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'id',
    displayName: 'ID',
    description:
      'Returns the sequence of element nodes having an ID value matching the one or more of the supplied IDREF values.',
    returnType: Types.Element,
    returnCollection: true,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.String,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'node',
        displayName: '$node',
        description: '$node',
        type: Types.Node,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'idref',
    displayName: 'IDREF',
    description:
      'Returns the sequence of element or attribute nodes with an IDREF value matching one or more of the' +
      ' supplied ID values.',
    returnType: Types.Node,
    returnCollection: true,
    arguments: [
      {
        name: 'arg',
        displayName: '$arg',
        description: '$arg',
        type: Types.String,
        minOccurs: 1,
        maxOccurs: Number.MAX_SAFE_INTEGER,
      },
      {
        name: 'node',
        displayName: '$node',
        description: '$node',
        type: Types.Node,
        minOccurs: 0,
        maxOccurs: 1,
      },
    ],
  },
  {
    name: 'doc',
    displayName: 'DOC',
    description: 'Returns a document node retrieved using the specified URI.',
    returnType: Types.DocumentNode,
    arguments: [{ name: 'uri', displayName: '$uri', type: Types.String, minOccurs: 1, maxOccurs: 1 }],
  },
  {
    name: 'doc-available',
    displayName: 'DOC available',
    description: 'Returns true if a document node can be retrieved using the specified URI.',
    returnType: Types.Boolean,
    arguments: [{ name: 'uri', displayName: '$uri', type: Types.String, minOccurs: 1, maxOccurs: 1 }],
  },
  {
    name: 'collection',
    displayName: 'Collection',
    description:
      'Returns a sequence of nodes retrieved using the specified URI or the nodes in the default collection.',
    returnType: Types.Node,
    returnCollection: true,
    arguments: [{ name: 'arg', displayName: '$arg', type: Types.String, minOccurs: 0, maxOccurs: 1 }],
  },
  {
    name: 'element-with-id',
    displayName: 'Element With ID',
    description:
      'Returns the sequence of element nodes that have an ID value matching the value of one or more of the' +
      ' IDREF values supplied in $arg.',
    returnType: Types.Element,
    returnCollection: true,
    arguments: [
      { name: 'arg', displayName: '$arg', type: Types.String, minOccurs: 1, maxOccurs: Number.MAX_VALUE },
      { name: 'node', displayName: '$node', type: Types.Node, minOccurs: 0, maxOccurs: 1 },
    ],
  },
] as IFunctionDefinition[];
