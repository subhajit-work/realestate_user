import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ModalController, IonContent, MenuController, Platform, AlertController } from '@ionic/angular';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { CommonUtils } from './../../services/common-utils/common-utils';
import { AuthService } from './../../services/auth/auth.service';

import { environment } from '../../../environments/environment';
import { query } from '@angular/animations';
import { PaginationService } from './../../services/pagination.service';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content: IonContent;

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  model: any = {};
  isListLoading = false;
  page = 1;
  noDataFound = true;
  fetchItems;
  tableHeaderData;
  skilltableHeaderData;
  tableHeaderDataDropdown;
  current_url_path_name;
  tableheaderDropdown;
  tableheaderDropdownChecked;
  private viewPageDataSubscribe: Subscription;
  private itemsHeaderSubscribe: Subscription;
  private jobHeaderSubscribe : Subscription;
  private formSubmitSearchSubscribe: Subscription;
  private getCountrySubscribe: Subscription;
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  disableApplyButton = false;
  headerUrlapi;
  headerSkillapi;
  headerJobapi;
  listing_url;
  countryList;
  stateList;
  cityList;

  // ......check uncheck start....
  itemcheckClick = false;
  checkedList = [];
  allselectModel;
  // check uncheck end

  // api parms
  api_parms: any = {};
  urlIdentifire = '';
  genderArry = [
    {
      name: "Male",
      value: "M"
    },
    {
      name: "Female",
      value: "F"
    },
    {
      name: "Other",
      value: "O"
    },
  ];
  maritalStatus = [
    {
      name: "Single",
      id: 1
    },
    {
      name: "Married",
      id: 2
    },
    {
      name: "Divorced",
      value: 3
    },
    {
      name: "Separated",
      value: 4
    },
  ];

  constructor(
    private plt: Platform,
    private storage: Storage,
    private pagerService: PaginationService,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private http : HttpClient,
    private modalController : ModalController,
    private commonUtils : CommonUtils,
    private authService : AuthService,
  ) { }

  // tslint:disable-next-line: comment-format
  // pager object
  pager: any = {};
  // paged items
  pageItems: any[];

  listAlldata;
  getCountry_api;
  country;

  // ------ init function call start -------
  commonFunction(){
    // get active url name
    this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    this.model = {
      profile : true
    }

    // table header data url name
    this.headerSkillapi = 'student/dashboard_skill_header';

    this.headerJobapi = 'student/dashboard_job_header';

    
    // view page url name
    this.listing_view_url = 'get-user' ;

    this.getCountry_api = 'country';

    this.getCountry();

    this.viewPageData(); 

    // view data call (autologin check)
    this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    this.jobHeaderSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onHeaderSkillData(); 
      }
    })

    this.itemsHeaderSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.onHeaderData(); 
      }
    })

    // view data call (userdetails from header login only)
    this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>..11111 >', res);
      if(res){
        this.viewPageData(); 
      }
    })

  }


  ngOnInit() {
    this.commonFunction();
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

  // ion View Will Enter call
  ionViewWillEnter() {
    this.commonFunction();
  }

  ionViewDidEnter(){
    // go to scroll top in mozila browser
    this.content.scrollToTop(0);
  }

  // --------- table header function -----------
  onHeaderData() {
      this.itemsHeaderSubscribe = this.http.get(this.headerSkillapi).subscribe(
        (res:any) => {

        // console.log('resData1', resData);
        this.tableHeaderData = res.return_data;
        console.log('tableHeaderData', this.tableHeaderData);
      },
      errRes => {
        // this.isLoading = false;
      }
      );
  }

  onHeaderSkillData() {
      this.jobHeaderSubscribe = this.http.get(this.headerJobapi).subscribe(
        (res:any) => {

        console.log('resData', res);
        this.skilltableHeaderData = res.return_data;
      },
      errRes => {
        // this.isLoading = false;
      }
      );
  }

  /*==========Goto view page button==========*/

  form_submit_text = 'Surging Employability';
  form_api = 'skill/return_index';
  onclickNext(_identifire){

    let fd = new FormData();
    // login or not check
    if(_identifire == 'skill'){
      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){

              this.router.navigateByUrl(`skill-list?qualification_id=${this.viewData.qualification_data.qualification_id}&degree_id=${this.viewData.qualification_data.degree_id}`);
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );
    }else if(_identifire == 'job'){
      this.formSubmitSearchSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response:any) => {
          this.form_submit_text = 'Surging Employability';
          console.log("add form response >", response);

          if(response.return_status > 0){

              this.router.navigateByUrl(`job-list?qualification_id=${this.viewData.qualification_data.qualification_id}&degree_id=${this.viewData.qualification_data.degree_id}`);
          }
        },
        errRes => {
          this.form_submit_text = 'Surging Employability';
        }
      );
    }
  }




  // open description
  openDescription(event, _item, _items){
    _item.isOpenDescription = !_item.isOpenDescription;

    /* _items.forEach(element => {
      element.isOpenDescription = false;
    });
    if(_item){
      _item.isOpenDescription = true;
    } */
  }


  // ================== view data fetch start =====================
    viewPageData(){
      this.viewLoadData = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          console.log("view data  res -------------------->", res.return_data);
          if(res.return_status > 0){
            this.viewData = res.return_data;
          }
        },
        errRes => {
          this.viewLoadData = false;
        }
      );
    }
  // view data fetch end

  // ========= datepicker start =======
  datePickerObj: any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  // get selected date
  myFunction(){
    console.log('get seleted date');
  }

  startdatePickerObj: any = {
    dateFormat: 'DD/MM/YYYY',
    closeOnSelect: true,
    yearInAscending: true
    //inputDate: new Date('2018-08-10'), // default new Date()
  };

  endDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  };

  certificationEndDatePickerObj:any ={
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  experienceEndDatePickerObj:any = {
    dateFormat: 'DD/MM/YYYY', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }

  // --- start date select ---
  selectCycleDate;
  getStartDate;
  onDateChangeDate(_identifire, _item,  _itemDate){

    console.log('onDateChangeDate _identifire>', _identifire);
    console.log('onDateChangeDate _item >', _item);
    console.log('onDateChangeDate _itemDate >', _itemDate);

    if(_itemDate){
      // ----- original date format convert start -----
        let myFormatDate = _itemDate.split(" ")[0].split("/");
        let _mynewdate = myFormatDate[2] + "-" + myFormatDate[1] + "-" + myFormatDate[0];
      // original date format convert end

      console.log('_itemDate  start date select >>>', _itemDate);
      this.model.end_date = '';

      
      if(_identifire == 'certification_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.certificationEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }else if(_identifire == 'experience_start_date'){
        _item.end_date = '';
        _item.duration = '';
        this.experienceEndDatePickerObj = {
          dateFormat: 'DD/MM/YYYY',
          fromDate: new Date(_mynewdate),
          closeOnSelect: true,
          yearInAscending: true
        };
      }

      // ----- no of day calculate start --------
      /* const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      const firstDate = new Date(2008, 1, 12);
      const secondDate = new Date(2008, 1, 22);

      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay)); */
      
      // no fo day calculate end

    }else{
      _item.end_date = '';
      _item.duration = '';
    }
    
  }


// datepicker  end

// ======================== form submit start ===================
clickButtonTypeCheck = '';
form_submit_text_save = 'Save';
form_submit_text_save_another = 'Save & Add Another' ;

// click button type 
clickButtonType( _buttonType ){
  this.clickButtonTypeCheck = _buttonType;
}

onSubmit(form:NgForm){

}
// form submit end

  // Get Country code start
  getCountry(){
    this.getCountrySubscribe = this.http.get(this.getCountry_api).subscribe(
      (res:any) => {
      this.country =res.return_data;
      console.log('country', res);
    },
    errRes => {
    }
    );
  }
  // Get country code end

  // editOrNot start
  editOrNot(_identifier, _value){
    if(_identifier == 'profile'){
      if(_value == true){
        this.model.profile = false;
      }else {
        this.model.profile = true;
      }
    }
  }
  // editOrNot end


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.itemsHeaderSubscribe !== undefined){
        this.itemsHeaderSubscribe.unsubscribe();
      }
      if(this.jobHeaderSubscribe !== undefined) {
        this.jobHeaderSubscribe.unsubscribe();
      }
      if(this.formSubmitSearchSubscribe !== undefined){
        this.formSubmitSearchSubscribe.unsubscribe();
      }
      if(this.getCountrySubscribe !== undefined){
        this.getCountrySubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}

