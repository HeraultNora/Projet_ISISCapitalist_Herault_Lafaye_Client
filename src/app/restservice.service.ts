import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { World, Pallier, Product } from './world';
@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  server = "http://localhost:8080/"
  user = "";

  constructor(private http: HttpClient) {
  }

  public getUser() {
    return this.user;
  }
  public setUser(user:string) {
    this.user = user;
  }

  public getServer() {
    return this.server;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  getWorld(): Promise<World> {
    return this.http.get(this.server + "adventureisis/generic/world")
    //Cela ne fonctionne pas, toutes nos images et valeurs disparaissent
    //, { 
    //headers: this.setHeaders(this.user)})
      .toPromise().catch(this.handleError);
  };
  private setHeaders(user: string): HttpHeaders { 
    var headers = new HttpHeaders({ 'X-User': user}); 
    return headers; };

}
