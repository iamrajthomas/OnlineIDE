import { Component, OnInit, AfterViewChecked, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms'

import { Compiler } from 'src/app/shared/models/compiler.model';
import { TokenResponse } from 'src/app/shared/models/token-response.model';
import { CompilerService } from 'src/app/shared/services/compiler.service';


@Component({
  selector: 'app-compiler',
  templateUrl: './compiler.component.html',
  styleUrls: ['./compiler.component.css']
})
export class CompilerComponent implements OnInit, AfterViewChecked {

  // Constants
  private CODE_LANGUAGE : number = 48;

  // Static Data from the server as Lookup
  codeLanguageList: any[] = [
    { id: 48, displayName: 'C' },
    { id: 76, displayName: 'C++' },
    { id: 51, displayName: 'C#' },
    { id: 62, displayName: 'Java' },
    { id: 63, displayName: 'JavaScript' },
    { id: 74, displayName: 'TypeScript' },
    { id: 78, displayName: 'Kotlin' },
    { id: 60, displayName: 'Go' },
    { id: 70, displayName: 'Python' },
  ];

  codeForm : FormGroup;
  codeProgress: string = '';
  codeLanguage: any = null;
  codeInput: string = '';
  codeOutput: string = '';
  userInput: string = '';
  
  statusDescription: string = '';
  compile_output: string = '';
  time: string = '';
  memory: string = '';
  compiler: Compiler;

  constructor(private _fb: FormBuilder, 
    private compilerService: CompilerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.onCleanUpActivity();

    this.codeInput = `// Hello World in C Program
    #include <stdio.h>
    int main() {
       // printf() displays the string inside quotation
       printf("Hello World with Raj Thomas...!!");
       return 0;
    }
    ` 
    this.codeLanguage = this.CODE_LANGUAGE;

    this.codeForm = this._fb.group({
      codeInput: ['', Validators.required],
      codeLanguage: ['', Validators.required],
      codeOutput: [''],
      userInput: [''],

    })
  }

  ngAfterViewChecked(){
    // Code to update the model
    // This prevents the DOM element change console error
    // ERROR Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. 
    // Previous value for 'disabled': 'true'. Current value: 'false'.. Find more at https://angular.io/errors/NG0100
    this.cdr.detectChanges();
  }

  // Dropdown events captured
  onDropDownChangeCodeLanguage(e: any){    
    // console.log(e.target.value);
  }

  onReactiveFormSubmitCode() : void {
    event?.preventDefault();
    this.onPostRunCode(this.codeForm.value);
  }

  onPostRunCode = async (codeForm : Compiler) => {
    this.onCleanUpActivity();

    this.codeProgress = "Creating Submission ... Please wait..!! \n";
    this.compiler = codeForm as Compiler;
    (await this.compilerService.onPostRunCode(this.compiler)).subscribe(
      res => {
        this.onGetRunCode(res);
        new Promise(resolve => setTimeout(resolve, 1000)); //UX purpose delaying display message!!
        this.codeProgress += "Submission Created...!! \n";
      },
      err => {         
        console.error(err); 
        this.codeProgress = 'ERROR: ' +  err.error.message;
      });
  }

  onGetRunCode = (resInput: TokenResponse) => {
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    
    
    this.compilerService.onGetRunCode(resInput)?.subscribe(
      res => {
        // NOTE: The stdout and compile_output are encoded. So you need to decode to show on the UI.       
        this.codeOutput = atob(res?.stdout); // this.codeOutput = result2?.stdout;
        this.time = res?.time;
        this.memory = res?.memory;
        this.compile_output = atob(res?.compile_output); // this.compile_output = result2?.compile_output;
        this.statusDescription = res?.status?.description;

        //setting up the loop conditional value here 
        jsonGetSolution.status.description = res?.status?.description;
        jsonGetSolution.stderr= res?.stderr;
        jsonGetSolution.compile_output = res?.compile_output;

        if(
          jsonGetSolution.status.description !== "Accepted" &&
          jsonGetSolution.stderr == null &&
          jsonGetSolution.compile_output == null
        ){
          this.onGetRunCode(resInput);
        }
        this.codeProgress = '';
      },
      err => {
        console.error(err); 
      }
    );
  }

  onCleanUpActivity = () => {
    this.codeOutput = '';
    this.codeProgress = '';
    this.time = '';
    this.memory = '';
    this.statusDescription = '';
    this.compile_output = '';
  }

}
