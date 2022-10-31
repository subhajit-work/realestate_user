import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, ModalController, AlertController, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

import { CommonUtils } from '../../services/common-utils/common-utils';
import { AuthService } from '../../services/auth/auth.service';

import { environment } from '../../../environments/environment';

/* tslint:disable */ 
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  constructor(
    private plt: Platform,
    private modalController : ModalController,
    private authService: AuthService,
    private storage: Storage,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private alertController : AlertController,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  // variable declartion section
  model: any = {};
  get_api;
  parms_action_name;
  private profileDataSubscribe:Subscription;
  private viewPageDataSubscribe:Subscription
  // ------ init function call start ------

    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);
      
      this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
      
      this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
        console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
        if(res){
          // this.viewPageData(); 
        }
      })

      // init call
      this.init();
      
    }

  // init
  ngOnInit() {
  //  this.commonFunction();
  }

  // scroll event detect
  isFixedHeader;
  onScrollHedearFix(event) {
    // console.log('scroll onnnnnnnnn', event.detail.scrollTop);
    if (event.detail.scrollTop > 56) {
      // console.log("scrolling down, hiding footer...iffffffffffff");
      this.isFixedHeader = true;
    } else {
      // console.log("scrolling up, revealing footer...elseeeeeeeeeeeeeee");
      this.isFixedHeader = false;
    };
  }

  ionViewWillEnter() {
    this.commonFunction();
  }
  
  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }
  
  // ---------- init start ----------
  init(){
    //edit data call
    this.profileDataSubscribe = this.http.get('api/user-profile').subscribe(
      (res:any) => {
        console.log("Edit data  res >", res.return_data);
          this.model = res.return_data;
          console.log('this.ProfileData',this.model);
      },
      errRes => {
      }
    );
  }
  // ---------- init end ----------


// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.profileDataSubscribe !== undefined){
      this.profileDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}