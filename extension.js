const vscode = require('vscode');
const addComment = require('./commentAdd');
const updateComment = require('./commentUpd');
const deleteComment = require('./commentDel');

// 读取配置项，并设置默认值
const config = vscode.workspace.getConfiguration();
global.keyword1 = config.get('CommentAssist.keyword1', '');
global.keyword2 = config.get('CommentAssist.keyword2', '');
global.keyword3 = config.get('CommentAssist.keyword3', '');

// 哪个被配置now，则替换成系统日期
if (global.keyword1 === 'now') {
    global.keyword1 = getCurrentDate();
}
if (global.keyword2 === 'now') {
    global.keyword2 = getCurrentDate();
}
if (global.keyword3 === 'now') {
    global.keyword3 = getCurrentDate();
}

// 哪个不为空，则后面加一个半角空格
if (global.keyword1 !== '') {
    global.keyword1 += ' ';
}
if (global.keyword2 !== '') {
    global.keyword2 += ' ';
}
if (global.keyword3 !== '') {
    global.keyword3 += ' ';
}

function activate(context) {
    // 注册命令
    let disposableAdd = vscode.commands.registerCommand('extension.commentAdd', function () {
        addComment(vscode.window.activeTextEditor);
    });
    let disposableUpd = vscode.commands.registerCommand('extension.commentUpd', function () {
        updateComment(vscode.window.activeTextEditor);
    });
    let disposableDel = vscode.commands.registerCommand('extension.commentDel', function () {
        deleteComment(vscode.window.activeTextEditor);
    });

    context.subscriptions.push(disposableAdd);
    context.subscriptions.push(disposableUpd);
    context.subscriptions.push(disposableDel);
}

module.exports = {
    activate
};

// 系统日期取得
function getCurrentDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = padZero(now.getMonth() + 1);
    let day = padZero(now.getDate());
    return `${year}/${month}/${day}`;
}

// 左补0
function padZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}