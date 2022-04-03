export class TokenResponse {

    //Note:: 3rd April 2022
    //The role of the TokenResponse class is just to create an instance of TokenResponse for response mapping
    public token: string;
    
    constructor(token: string = '') {
        this.token = token;
    }

}
