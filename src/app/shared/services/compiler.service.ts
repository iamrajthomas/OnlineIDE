import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Compiler } from '../models/compiler.model';
import { TokenResponse } from '../models/token-response.model';

import { environment as prodEnvironment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CompilerService {

  constructor(private _http: HttpClient) { }

  private BASE_URL: string = prodEnvironment.BASE_URL;
  private API_KEY = prodEnvironment.API_KEY; // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
  
  onPostRunCode = async (compiler: Compiler) => {

    const headers = { 
      'content-type': 'application/json',
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "x-rapidapi-key": this.API_KEY, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
      accept: "application/json",
    } 

    const body = JSON.stringify({ 
          source_code: compiler.codeInput,
          stdin: compiler.userInput,
          language_id: compiler.codeLanguage,
    });
    return this._http.post<TokenResponse>(this.BASE_URL, body, {'headers': headers});
  }

  onGetRunCode = (data : TokenResponse) => {
    if(data?.token != null || data?.token != undefined){
      let _url = `${this.BASE_URL}/${data?.token}?base64_encoded=true`;
      const headers = { 
        'content-type': 'application/json',
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "x-rapidapi-key": this.API_KEY, // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
      }
      // const body = null;
      const result = this._http.get<any>(_url, {'headers': headers});
      return result;
    }
    else{
      return;
    }
  }

}
