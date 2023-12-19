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
  - ID - Unique id (secondary key)
  - Name - Unique name (primary key), e.g. "contact", "asset", "note"
  - Fields - A list of field definition IDs expected to be present on blocks of this type
- Blocks - This is the main container for content. It has the following properties
  - ID - Unique id (primary key)
  - Title - Plain text 
  - Type - "text" | "file"
  - BlockDefinitionID - The id of the block definition this block belongs to
  - Data - The contents. Either plain text if type is "text" or an block with url and encoding as properties if type is "file"
- FieldDefinitions - Defines what properties a user can apply to an block
  - ID - Unique id (primary key)
  - Name - Unique name (secondary key), e.g. "project", "responsible", "due-date"
  - ValueType - "block" | "text" | "date" - If the value is an block, the value is the id of a rel block
- Fields - The actual properties a user has applied to an block. It has the following properties
  - ID - Unique id (primary key)
  - SourceBlockID - The id of the block this field originates from
  - TargetBlockID - The id of the block this field points to
  - FieldDefinitionID - The id of the field definition this field belongs to
  - Value - The value of the field
  - ValueType - "block" | "text" | "date" - If the value is an block, the value is the id of a rel block

## Pages:
- list-blocks: Table that lists all blocks. There should be a button to add a new block
- block: A common add, edit, view page for blocks. The page should contain following components
  - Title: A editable text field for the title of the block
  - Content: A editable text field for the content (data) of the block. The MDXEditor component should be used for this
  - Rendered content: The content compiled and rendered using MDX

## Functions:
- Changes made in title or content component within the block page should be saved on change to the database
- On change the content of the content component should be parsed so that:
  - "::FIELD-NAME::FIELD-VALUE" (eg. "::project::test-project") trigger a creation of a new Field creation with the following properties
    - SourceBlockID: The id of the current block
    - TargetBlockID: The id of the block with the name given as FIELD-VALUE, e.g. "test-project"
    - If ValueType of given FieldDefinition is "block", then
      - FieldDefinitionID: The id of the field definition with the name given as FIELD-NAME, e.g. "project"
      - Value: undefined
    - If ValueType of given FieldDefinition is "text", then
      - FieldDefinitionID: undefined
      - Value: The value given as FIELD-VALUE, e.g. "test-project"
  - If no definition matching FIELD-NAME exists then a new FieldDefinition should be created with the following properties
    - Name: The name given as FIELD-NAME, e.g. "project"
    - ValueType: "block"
  - If no block matching FIELD-VALUE exists then a new Block should be created with the following properties
    - Title: The name given as FIELD-VALUE, e.g. "test-project"
    - Type: "text"
    - Data: Empty string
    - BlockDefinitionID: undefined
  - On render "::FIELD-NAME::FIELD-VALUE" should be replaced with a hyperlink to the target block (if any)
- All Blocks and Fields should be available in runtime within the MDXEditor as two arrays:
  - blocks: A typed array of all blocks
  - fields: A typed array of all fields