import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { IonContent, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-all-agents',
  templateUrl: './all-agents.page.html',
  styleUrls: ['./all-agents.page.scss'],
})
export class AllAgentsPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  constructor(
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private http : HttpClient,
    private modalController : ModalController,
    private commonUtils : CommonUtils,
  ) { }

  private getallAgentsSubscribe: Subscription;
  agents_Url:any;
  viewData:any;
  
  ionViewWillEnter() {
    this.commonFunction();
  }

  commonFunction(){
    this.getagents()
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

  slickInit(e) {
    // console.log('........ slick initialized ......');
  }
  
  breakpoint(e) {
    // console.log('breakpoint');
  }
  
  afterChange(e) {
    // console.log('afterChange');
  }
  
  beforeChange(e) {
    // console.log('beforeChange');
  }
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

  getLoading;
  getagents(){
      this.getLoading = true;
      this.agents_Url='agents';
      this.getallAgentsSubscribe = this.http.get(this.agents_Url).subscribe(
        (res:any) => {
          this.getLoading = false;
          console.log("View All Agents Data....",res);
          
          if(res.return_status > 0){
            if(res.return_data == null){
              this.viewData = res.return_data
            }else{
            }
          }
        },
        errRes => {
          this.getLoading = false;
          // this.selectLoadingDepend = false;
        }
      );
  }

    // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.getallAgentsSubscribe !== undefined){
        this.getallAgentsSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}
