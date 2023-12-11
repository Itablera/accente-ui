# Requirements:
The product is an visual object manager where the user can define and add blocks such as contact, asset and note; and easily add relations between these blocks.

## Architecture:
- React and TypeScript
- Use MDX at render
- Client side first. No server
- PouchDB as database
- Event driven

## Model:
- BlockDefinition - Defines what properties an block can have
  - Name - Unique name (primary key), e.g. "contact", "asset", "note"
  - Fields - A list of field definition IDs expected to be present on blocks of this type
- Blocks - This is the main container for content. It has the following properties
  - ID - Unique id (primary key)
  - Title - Plain text 
  - Type - "text" | "file"
  - BlockDefinitionID - The id of the block definition this block belongs to
  - Data - The contents. Either plain text if type is "text" or an block with url and encoding as properties if type is "file"
- FieldDefinitions - Defines what properties a user can apply to an block
  - Name - Unique name (primary key), e.g. "project", "responsible", "due-date"
  - ValueType - "block" | "text" | "date" - If the value is an block, the value is the id of a rel block
- Fields - The actual properties a user has applied to an block. It has the following properties
  - ID - Unique id (primary key)
  - SourceBlockID - The id of the block this field originates from
  - TargetBlockID - The id of the block this field points to
  - FieldDefinitionID - The id of the field definition this field belongs to
  - Value - The value of the field
  - ValueType - "block" | "text" | "date" - If the value is an block, the value is the id of a rel block