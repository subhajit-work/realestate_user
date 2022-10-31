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
  selector: 'app-news-details',
  templateUrl: './news-details.page.html',
  styleUrls: ['./news-details.page.scss'],
})

export class NewsDetailsPage implements OnInit, OnDestroy {

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
  private getNewsSubscribe: Subscription;
  getNewsContact_api;
  parms_action_id;
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
  newsData:any = [];

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
    this.listing_view_url = 'get-our-stories/'+this.parms_action_id;

    this.viewPageData(); 

    // getNews api
    this.getNewsContact_api = 'get-our-stories';

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

  //getNews

  getNews(){
    this.getNewsSubscribe = this.http.get(this.getNewsContact_api).subscribe(
      (res:any) => {
      console.log('sss', res);
      let allNews = res.return_data;
      this.newsData = [];
      for (let index = 0; index < allNews.length; index++) {
        if(allNews[index].service_type == this.viewData.service_type && this.viewData.id !== allNews[index].id) {
          this.newsData.push(allNews[index]);
          console.log('>>', allNews[index]);
          
        }
        
      }
      console.log('this.newsData', this.newsData);

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
          this.getNews();
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  // Rewlated slider start
  relatedProductSlideConfig = {
    "slidesToShow": 3, 
    "slidesToScroll": 1,
    "nextArrow":"<div class='nav-btn next-slide'></div>",
    "prevArrow":"<div class='nav-btn prev-slide'></div>",
    "dots":false,
    "infinite": true,
    "autoplay": true,
    "speed": 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 4,
          infinite: true,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
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
  // Related slider end

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.getNewsSubscribe !== undefined){
        this.getNewsSubscribe.unsubscribe();
      }
    }
  // destroy subscription end
}