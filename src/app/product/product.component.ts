import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { World, Product, Pallier } from '../world';
import { RestserviceService } from '../restservice.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  product: Product = new Product();
  server: string;
  progressbarvalue: number = 0;
  lastupdate: number = 0;
  _qtmulti: any;
  money: number =0;
  _isqtmulmax: boolean=false;
  _coutproduct :any;

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Input()
  set qtmultit(value: string) {
    if (value == "max") {
      this._isqtmulmax = true;
    }
    else {
      this._isqtmulmax = false;
    }
    this._qtmulti = value;
    if (this._isqtmulmax && this.product) {
      this._qtmulti = this.calcMaxCanBuy();
      this._coutproduct = this.calcMaxCanBuy();
    }
  }

  @Input()
  set moneyJoueur(value: number) {
    this.money = value;
  }

  @Input()    
    calcMaxCanBuy():any {
      let argent = this.money;
      (Math.log(1-(argent*(1-this.product.croissance))/this.product.cout)/(Math.log(this.product.croissance)))
    }
  constructor(private service: RestserviceService) {
    this.server = service.getServer();
  }

  startFabrication() {
    if (this.product.quantite > 0) {
      this.lastupdate = Date.now();
      this.product.timeleft = this.product.vitesse;
    }
  }
  buy() {
    this._coutproduct = this._qtmulti * this.product.cout;
    this.product.quantite += this._qtmulti;
    this.notifyAchat.emit(this._coutproduct);
    //this.service.putProduct(this.product);
  }
  calcScore() {
    if (this.product.timeleft != 0) {
      let temps_ecoule = Date.now() - this.lastupdate;
      this.lastupdate = Date.now();
      this.product.timeleft = this.product.timeleft - temps_ecoule;
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbarvalue = 0;
        this.notifyProduction.emit(this.product);
      }
      else
        this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;

      // on prévient le composant parent que ce produit a généré son revenu. 
    }
    if (this.product.managerUnlocked && this.product.timeleft == 0 && this.product.quantite > 0) {
      this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
    }
  }


  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
  }

  @Output() notifyProduction: EventEmitter<Product> = new
    EventEmitter<Product>();

  @Output() notifyAchat: EventEmitter<number> = new
    EventEmitter<number>();

}

