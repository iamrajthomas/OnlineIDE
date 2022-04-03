export class Compiler {


    //Note:: 27th March 2022
    //The role of the Compiler class is just to create an instnace of compiler and give it to the caller for usage

    public codeInput: string;
    public codeLanguage: string;
    public codeOutput: string;
    public userInput:  string;
    

    constructor(codeInput: string, codeLanguage: string = 'C', codeOutput: string = '', userInput: string = '') {
        this.codeInput = codeInput;
        this.codeLanguage = codeLanguage;
        this.codeOutput = codeOutput;
        this.userInput = userInput;
    }
}
