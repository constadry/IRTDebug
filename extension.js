// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "snake" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let addtrycatch = myCommand("addtrycatch", "try {\n", "\n} catch (error) {\n\n}");
	let addifelse = myCommand("addifelse", "if () {\n", "\n} else {\n\n}");

	context.subscriptions.push(addtrycatch);
	context.subscriptions.push(addifelse);
}

/**
 * @param {string} name
 * @param {string} start
 * @param {string} end
 */
function myCommand(name, start, end) {
	return vscode.commands.registerCommand("jsblockhelper.".concat('', name), function () {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;

			const selection = editor.selection;
			const word = document.getText(selection).replaceAll('\n', '\n\t').replace(/^/, '\t');

			editor.edit(editBuilder => {
				editBuilder.insert(selection.start, start);
				editBuilder.replace(selection, word);
				editBuilder.insert(selection.end, end);
			});
		}
	});
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
