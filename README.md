# Deprecated
There is no longer any need to use this extension, since the functionality is now provided natively in Visual Studio Code.

This can configured in **Keyboard Shortcuts** under **File: Copy Relative Path of Active File** (`copyRelativeFilePath`). It is recommended that you remove the **When** condition of `!editorFocus` to make the command usable when you're actually editing the file.

![image](https://user-images.githubusercontent.com/5355888/142937208-ce8a03ab-2b25-4a98-8739-53b5a3c11343.png)

# Copy Relative Path of Active File

A Visual Studio Code extension for copying the relative path of an active file to the clipboard.

## Usage

Add something like this to your `keybindings.json`
```
{"key": "cmd+shift+c", "command": "extension.copyRelativePathOfActiveFile"}
```
