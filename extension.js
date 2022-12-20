// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let funcExecutor = myCommand();
	context.subscriptions.push(funcExecutor);
}


function myCommand() {
	return vscode.commands.registerCommand("jsblockhelper.funcExecutor", function () {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			const word = document.getText(selection);
			let allText = document.getText();
			var esprima = require('esprima');
			var program = allText;
			var entries = [];
			let parsed = esprima.parseScript(program, {}, function (node, meta) {
						entries.push({
							start: meta.start.offset,
							end: meta.end.offset,
							node: node
						});
				})
			
			//find function definations
			var functionDeclarations = entries.filter(e => e.node.type == 'FunctionDeclaration')
			console.log('function definations: ' + JSON.stringify(functionDeclarations.map (a => {return {name: a.node.id.name, start: a.start, end: a.end}})))
			
			//find word() function defination
			var wordFunctionDeclaration = entries.filter(e => e.node.type == 'FunctionDeclaration' && e.node.id.name == word)
			console.log('foo function definations: ' + JSON.stringify(functionDeclarations.map (a => {return {start: a.start, end: a.end}})))
			var fnOffsets = wordFunctionDeclaration.map(a => {return {start: a.start, end: a.end}});
			// var prFormatted = program.replaceAll('\r\n', '');
			var fnStr = program.substring(fnOffsets[0].start, fnOffsets[0].end);
			var fn = eval('(' + fnStr + ')');
			let num = fn();
			editor.edit(editBuilder => {
				editBuilder.replace(selection, word + '\r\n' + num);
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
