import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AddCommonModelPage } from '../modal/add-common-model/add-common-model.page';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-buy-sell-properties',
  templateUrl: './buy-sell-properties.page.html',
  styleUrls: ['./buy-sell-properties.page.scss'],
})
export class BuySellPropertiesPage implements OnInit, OnDestroy {

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
  tableHeaderDataDropdown;
  current_url_path_name;
  private viewPageDataSubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  parms_action_id;
  listing_view_url;
  viewLoadData;
  viewData;
  disableApplyButton = false;
  commonPageData;
  selectLoadingDepend: boolean;
  desc: any;
  work: any;
  contactPurpose = [
    {
      id: 1,
      name : 'Sell'
    },
    {
      id: 1,
      name : 'Buy'
    }
  ]

  constructor(
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

  // mat-accordion open start
    step = 0;

    setStep(index: number) {
      this.step = index;
    }
  // mat-accordion end

  // ------ init function call start -------
  commonFunction(){
    // get active url name
    this.current_url_path_name =  this.router.url.split('/')[1] + 'ColumnSelect';
    this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    
    // view page url name
    this.listing_view_url = 'api/buy-sell-properties' ;
    this.viewPageData(); 

    // view data call (autologin check)
    this.viewPageDataSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
      }
    })

  }


  ngOnInit() {
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

  // ..... userAuthenticate modal start ......
  async userAuthenticateModal(_identifier, _item, _items) {
    // console.log('_identifier >>', _identifier);

    this.modalController.dismiss(); //click file first close

    let open_modal;
    let myclass;
    if(_identifier == 'forgotPassword' || _identifier == 'signIn'){
      myclass = 'mymodalClass signin';
    }else{
      myclass = 'mymodalClass';
    }

    open_modal = await this.modalController.create({
      component: AddCommonModelPage,
      cssClass: myclass,
      componentProps: { 
        identifier: _identifier,
        modalForm_item: _item,
        modalForm_array: _items
      }
    });
    
    // modal data back to Component
    open_modal.onDidDismiss()
    .then((getdata) => {
      // console.log('getdata >>>>>>>>>>>', getdata);
      if(getdata.data == 'submitClose'){
        /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
      }

    });

    return await open_modal.present();
  }
// userAuthenticate modal end 

  //----------- note slick slider for angular start -----------
  noteSlideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 1,
    "dots":false,
    "infinite": true,
    "autoplay": true,
    "speed": 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  };
  //--note slick slider for angular end--

  // ======================== form submit start ===================
  clickButtonTypeCheck = '';
  form_submit_text = 'Submit a query';
  form_submit_text_save = 'Save';
  form_submit_text_save_another = 'Save & Add Another' ;
  
  // Form api
  form_api = "api/make-query";
  // click button type 
  clickButtonType( _buttonType ){
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmit(form:NgForm){
    console.log("add form submit >", form.value);
    

    this.form_submit_text = 'Submitting';

    // get form value
    let fd = new FormData();
    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('value >', fd);

    if(!form.valid){
      return;
    }

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response:any) => {

        console.log("add form response >", response);

        if(response.return_status > 0){

          this.form_submit_text = 'Submit a query';

          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          this.model = {};
          
        }else {
          this.form_submit_text = 'Submit a query';
        }
      },
      errRes => {
        this.form_submit_text = 'Submit a query';
      }
    );

  }
  // form submit end


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.formSubmitSubscribe !== undefined){
        this.formSubmitSubscribe.unsubscribe();
      }
    }
  // destroy subscription end 
}