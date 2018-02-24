# Copy Relative Path of Active File

A Visual Studio Code extension for copying the relative path of an active file to the clipboard.

## Usage

Add something like this to your `keybindings.json`
```
{"key": "cmd+shift+c", "command": "extension.copyRelativePathOfActiveFile"}
```

Add an optional prefix to your project workspace settings `./.vscode/settings.json`
```
{
    "relativePath.prefix": "npm run mocha --"
}
```

Support for multiroot workspaces by adding multi-root to your workspace settings
```
{
    "relativePath.multi-root": true
}
```
