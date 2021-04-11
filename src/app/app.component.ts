import { Component, OnInit } from '@angular/core';
import { RestserviceService } from './restservice.service'; 
import { World, Product, Pallier } from './world';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent {
  title = 'ISISCapitalistLH';
  world: World = new World(); 
  server: string;
  showManagers = false;
  qtmulti: any;
  badgeManager: number=0;
  username: any;

  constructor(private service: RestserviceService, private snackBar: MatSnackBar) { 
    this.server = service.getServer();
    this.username = localStorage.getItem("username"); 
    this.service.setUser(this.username)
    service.getWorld().then( world => { 
      this.world = world; 
    }); 
    if (this.username == null || this.username == "") {
      this.newUser();
    }
    this.qtmulti = 1;
  }
  newUser() {
    var initialisationPseudo = "Captain";
    var nbAleatoire = Math.floor(Math.random() * 10000);
    this.username = initialisationPseudo + nbAleatoire;
  }

  popMessage(message : string) : void { 
    this.snackBar.open(message, "", { duration : 5000 }) 
  }
  badgeManagers(): void {
    this.badgeManager = 0;
    //Argent dispo
    var m = this.world.money;
    for (let mPallier of this.world.managers.pallier) {
      if (m >= mPallier.seuil && !mPallier.unlocked) {
        this.badgeManager += 1;
      }
    }
  }
  hireManager(manager : any) : void{
    this.world.money -= manager.seuil;
    manager.unlocked = true;
    this.world.products.product[manager.idcible - 1].managerUnlocked = true;
    this.popMessage("Le manager " + manager.name + " a été enagé.")
    this.badgeManagers();
  }

  setMulti(): void {
    if (this.qtmulti == 1) { this.qtmulti = 10; }
    else if (this.qtmulti == 10) { this.qtmulti = 100; }
    else if (this.qtmulti == 100) { this.qtmulti = "max"; }
    else if (this.qtmulti == "max") { this.qtmulti = 1; }
  }
  onProductionDone(p:Product) {
    this.world.money += p.revenu * p.quantite;
    this.world.score += p.revenu * p.quantite;
    this.badgeManagers();
  }
  onBuyDone(coutP : any) : void {
    this.world.money -= coutP;
    this.badgeManagers();  
  }
  onUsernameChanged(): void {
    localStorage.setItem("username", this.username);
  }
}