// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// This line of code will only be executed once when your extension is activated
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// 生成game_message.proto消息结构体
	let generateGameMessage = vscode.commands.registerCommand('protoex.exGameMessage', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		let pos = editor?.selection;
		let select_text = editor?.document.getText(pos);
		let lines = select_text?.split('\n');
		if (lines === undefined) {
			return;
		}

		// 直接多行一次替换有点问题，后面再试试，现在先分开行替换
		let doc = "";
		let count = 0;
		for (let line of lines) {
			let new_line = line?.replace(/.*CMD_([A-Z_]*).*/, "// CMD_$1\nmessage $1 {\n};\n");
			if (new_line === line) {
				continue;
			}
			count += 1;
			doc += new_line;
		}

		if (count === 0) {
			vscode.window.showWarningMessage("请框选需要转换的cmd再点击转换代码!");
			return;
		}
		
		// 复制到粘贴板
		vscode.env.clipboard.writeText(doc);
		vscode.window.showInformationMessage("成功生成" + count + "个命令代码，请粘贴到合适位置！");

		// 定位文件
		let filename = vscode.workspace.getConfiguration().get<string>('protoex.message_proto_path', "/protocol/game_message.proto");
		let filethen = vscode.workspace.openTextDocument(vscode.workspace.rootPath + filename);
		
		filethen.then((file)=>{
			// new vscode.Location(vscode.Uri.file(filename), new vscode.Position(0, 0));
			vscode.window.showTextDocument(file);
		});
	});


	// 生成错误码excel内容
	let generateErrCode = vscode.commands.registerCommand('protoex.exErrorCode', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		let pos = editor?.selection;
		let select_text = editor?.document.getText(pos);
		let lines = select_text?.split('\n');
		if (lines === undefined) {
			return;
		}

		// 直接多行一次替换有点问题，后面再试试，现在先分开行替换
		let doc = "";
		for (let line of lines) {
			let new_line = line?.replace(/\D*(\d*);\s*\/\/ (.*)/, "$1\t$2");
			if (new_line === line) {
				continue;
			}
			doc += new_line;
		}

		if (doc.search(/\t/) <= 0) {
			vscode.window.showWarningMessage("请框选需要转换的 错误码 再点击转换代码!");
			return;
		}
		
		// 复制到粘贴板
		vscode.env.clipboard.writeText(doc);
		vscode.window.showInformationMessage("成功生成" + lines.length + "个错误码文本，请粘贴到合适位置！");
	});


	// 生成lua handle处理代码
	let generateLuaHandle = vscode.commands.registerCommand('protoex.exLuaHandle', () => {
		// The code you place here will be executed every time your command is executed
		let editor = vscode.window.activeTextEditor;
		let pos = editor?.selection;
		let select_text = editor?.document.getText(pos);
		let lines = select_text?.split('\n');
		if (lines === undefined) {
			return;
		}

		// 直接多行一次替换有点问题，后面再试试，现在先分开行替换
		let doc = "";
		let extra_doc = "";
		let handle_count = 0;
		for (let line of lines) {
			let new_line = line?.replace(/.*(CMD_CS_[A-Z_]*).*/, 'RegisterPlayerHandle($1, "Stardom.$2", "on_$1")');
			let extra_line = line?.replace(/.*(CMD_CS_[A-Z_]*).*/, '\n\nfunction on_$1(pPlayer, tMessage)\nend');
			if (new_line === line || extra_line === line) {
				continue;
			}

			handle_count += 1;
			doc += new_line;
			extra_doc += extra_line;
		}

		if (handle_count === 0) {
			vscode.window.showWarningMessage("请框选需要转换的cmd再点击转换代码!");
			return;
		}

		// 复制到粘贴板
		doc += extra_doc;
		vscode.env.clipboard.writeText(doc).then(()=>{
			vscode.window.showInformationMessage("成功生成" + handle_count + "个lua处理函数，请粘贴到合适位置！");
		});
	});

	context.subscriptions.push(generateGameMessage);
	context.subscriptions.push(generateErrCode);
	context.subscriptions.push(generateLuaHandle);
}

// this method is called when your extension is deactivated
export function deactivate() {}

