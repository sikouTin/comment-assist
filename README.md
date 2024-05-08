# CommentAssistForTsAndHtmlSourceCode

## Features

 A comment will be inserted at the cursor position when the shortcut key is pressed.  
1. Alt+A : ADD  
    // ▼ Keyword1 Keyword2 Keyword3 ADD START  
    // ▲ Keyword1 Keyword2 Keyword3 ADD END  
2. Alt+S : UPDATE  
    // ▼ Keyword1 Keyword2 Keyword3 UPDATE START  
    // ▲ Keyword1 Keyword2 Keyword3 UPDATE END  
3. Alt+D : DELETE  
    // ▼ Keyword1 Keyword2 Keyword3 DELETE START  
    // ▲ Keyword1 Keyword2 Keyword3 DELETE END  

## Usage

1. Only ts files and html files are adapted.。  
2. If you need to change the shortcut keys, you can modify the keybindings.json file to implement the shortcut key modification function.  
    {  
        "key": "alt+a",  
        "command": "extension.commentAdd",  
        "when": "editorTextFocus"  
    },  
    {  
        "key": "alt+s",  
        "command": "extension.commentUpdate",  
        "when": "editorTextFocus"  
    },  
    {  
        "key": "alt+d",  
        "command": "extension.commentdelete",  
        "when": "editorTextFocus"  
    }  
3. You need to set Keyword1, Keyword2, and Keyword3 in the plug-in settings according to actual needs.  
   When any setting is set to the string "now", the system date(yyyy/MM/dd) will be output.  