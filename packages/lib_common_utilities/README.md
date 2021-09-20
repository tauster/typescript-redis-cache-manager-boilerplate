# Common Utilities Library

#### Includes common utilities that can be used across the stack

## General Notes on Library
-   Do not import the full `aws-sdk` package, or any other `externals` in webpack context. Only use the `cont packageName = require();` convention if needed
    -   This is because webpack has externals defined on the core packages which do not require bundling the imports
    -   Because of this only types/namespaces are able to be imported
-   No need to compile common packages, they will be webpacked with core packages when required