import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})

export class ServicePage implements OnInit, OnDestroy {

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
  private formSubmitConsultationSubscribe: Subscription;
  private getServiceSubscribe: Subscription;
  getServiceContact_api;
  parms_action_id;
  parms_action_name;
  listing_view_url;
  viewLoadData;
  viewData;
  disableApplyButton = false;
  commonPageData;
  selectLoadingDepend: boolean;
  getAboutSubscribe: Subscription;
  getCompanyAbout_api;
  desc: any;
  getWorkSubscribe;
  getCompanyWork_api;
  work: any;
  serviceData:any;

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
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');

    // view page url name
    this.listing_view_url = 'get-service-details/'+this.parms_action_name+'/'+this.parms_action_id;

    this.viewPageData(); 

    // getservice api
    this.getServiceContact_api = 'getservice';
    this.getService();

    // view data call (userdetails from header login only)
    this.viewPageDataSubscribe = this.commonUtils.signinCheckObservable.subscribe(res =>{
      console.log('getSiteInfoObservable res>>>>>>>>>>>>>>>>>>>..11111 >', res);
      if(res){
        this.viewPageData(); 
      }
    })

    // get data from commoninfo api
    this.viewPageDataSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) =>{
      console.log('commonPageData data res>>>>>>>>>>>>>>>>>>>.. >', res);
      if(res){
        this.commonPageData = res;
      }
    })

  }

  //getService
  getService(){
    this.selectLoadingDepend = true;
    this.getServiceSubscribe = this.http.get(this.getServiceContact_api).subscribe(
      (res:any) => {
      this.selectLoadingDepend = false;
      this.serviceData =res.return_data;
      console.log('sss', res);
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
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

  // ======================== Consultation submit start ===================
  form_submit_text = 'Surging Employability';
  form_api = 'addquery';

  onSubmitConsultation(form:NgForm){
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

    this.formSubmitConsultationSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response:any) => {
        this.form_submit_text = 'Surging Employability';
        console.log("add form response >", response);

        if(response.return_status > 0){
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);
          form.reset();

          // this.notifier.notify( type, 'aa' );
            // form.reset();

            // this.router.navigateByUrl(`skill-list?location=${form.value.location}&degree_id=${form.value.degree_id}&interest_id=${form.value.interest_id}`);
          
        }
      },
      errRes => {
        this.form_submit_text = 'Surging Employability';
      }
    );

  }
// Consultation submit end

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.formSubmitConsultationSubscribe !== undefined){
        this.formSubmitConsultationSubscribe.unsubscribe();
      }
      if(this.getServiceSubscribe !== undefined){
        this.getServiceSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}