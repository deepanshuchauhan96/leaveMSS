import { LightningElement, wire } from 'lwc';
import addLeave from 'c/addLeave';
import mangerApp from 'c/mangerApp';
import getLeaves from '@salesforce/apex/leaveData.getLeaves';
import getLeaveToApprove from '@salesforce/apex/leaveData.getLeaveToApprove';
import getLeaveChart from '@salesforce/apex/leaveData.getLeaveChart';
import Id from '@salesforce/user/Id'
import { refreshApex } from '@salesforce/apex';
import chartjs from "@salesforce/resourceUrl/chartjs";
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Lms extends LightningElement {
wiredleaveList = [];
wiredmleaveList = [];
wiredcleaveList = [];
isChart = true;
mdata = false;
    user = Id;
    connectedCallback() {
        console.log(this.user);
    }
ldata=false;
 isChartJsInitialized = false;
    chart1;
    chart2;
    chart3;
 async handleAdd() {
        const result = await addLeave.open({
            size: 'small', //small, medium, or large default :medium
            description: 'Add new Leave Request',
            content: '',
        });
        
        console.log('result',result);
if (result != 'ok'){
       setTimeout(() => {
          
          this.datalist=[];
       this.chart1.destroy();
        this.chart2.destroy();
        this.chart3.destroy();
    refreshApex(this.wiredleaveList);
    refreshApex(this.wiredmleaveList);
    refreshApex(this.wiredcleaveList);
}, 500);
       
}

       
    }

     @wire(getLeaves,{uid:'$user'}) 
     leaveList(result) {
    this.wiredleaveList = result;
 console.log(result);
    if (result.data) {
      
      this.ldata = result.data.map((ld) => ({ ...ld, isdisabled: ld.Status__c == 'Pending' ? false : true }));
      console.log(JSON.parse(JSON.stringify(this.ldata)));
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.ldata = [];
    }
  }

    @wire(getLeaveToApprove,{mid:'$user'}) 
     mleaveList(result) {
    this.wiredmleaveList = result;
 console.log(result);
    if (result.data) {
      console.log('mdata', JSON.parse(result.data));
      try{
      this.mdata = JSON.parse(result.data).map((ld) => ({ ...ld, isdisabled: ld.Status__c == 'Pending' ? false : true }));
      console.log(JSON.parse(JSON.stringify(this.mdata)));
      this.error = undefined;
      }catch(err){
console.log(err);
this.mdata= false;
      }
      
      
    } else if (result.error) {
      this.error = result.error;
      this.mdata = false;
    }
  }
async handleUpdate(event){
    console.log('hhhh',JSON.parse(JSON.stringify(event.detail)));
    if(event.detail.type == 'user'){
   const result = await addLeave.open({
            size: 'small',
            description: 'Update Leave Request',
            content: event.detail.id,
        });
    
        console.log(result);
           if (result != 'ok'){
    setTimeout(() => {
          this.datalist=[];
   this.chart1.destroy();
        this.chart2.destroy();
        this.chart3.destroy();
    refreshApex(this.wiredleaveList);
    refreshApex(this.wiredmleaveList);
    refreshApex(this.wiredcleaveList);
}, 500);
    }
        
    }else if(event.detail.type == 'manager'){
      const result = await mangerApp.open({
            size: 'small', 
            description: 'Update Leave Request',
            content: event.detail.id,
        });
    
        console.log(result);
         refreshApex(this.wiredleaveList);
    refreshApex(this.wiredmleaveList);
    refreshApex(this.wiredcleaveList);

    }
    
 
        
}

 @wire(getLeaveChart,{cid:'$user'}) 
     leavechartList(result) {
    this.wiredcleaveList = result;
    if(result.data){
      this.isChart = true;
      console.log(result.data);
      for (let i= 0;i<result.data.length;i++){
        const configD = {
          type: 'doughnut',
  data: {
    labels: ['Consumed Leave','Remaining Leave'],
  datasets: [{
    
    data: [result.data[i].Total_Consumed__c,result.data[i].Remaining_Leaves__c],
    backgroundColor:  ['#8b5f3c','#f89723'],
    hoverOffset: 4
  }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Allocated Leave: '+result.data[i].Total_Allocated__c,
        position: 'bottom'
      }
    }
  },
        }
        // this.datac.labels = ['Consumed Leave','Remaining Leave'];
        // this.datac.datasets[0].data =[result.data[i].Total_Consumed__c,result.data[i].Remaining_Leaves__c];
        
        // this.datac.datasets[0].backgroundColor = ['red','green'];
        
        // this.config.data = {...this.datac};
        // this.config.options.plugins.title.text = 'Total Allocated Leave: '+result.data[i].Total_Allocated__c;
        
        const chartdata = {
          config: configD,
          type: result.data[i].Leave_Type__c
        };
        // this.chartdata.type = result.data[i].Leave_Type__c;
        // console.log(JSON.parse(JSON.stringify(this.chartdata)));
        this.datalist.push(chartdata);
        
       
        

      }
      console.log(JSON.parse(JSON.stringify(this.datalist)));
     
      this.showChart1();
      this.showChart2();
      this.showChart3();
      
     
    }else if (result.error){
      console.log(result.error);
    }
     }

datalist= [];




showChart1(){
    
    console.log('Chart initialized ' + this.chart1Initialized)
    Promise.all([
        loadScript(this, chartjs)
    ]).then(() => {
        const ctx = this.template.querySelector('canvas.stacked1');
        console.log('ctx ' + ctx);
        
      this.chart1 =  new window.Chart(ctx, JSON.parse(JSON.stringify(this.datalist)).filter(x => x.type == 'Planned Leave')[0].config);
        this.chart1.canvas.parentNode.style.height = '319px';
            this.chart1.canvas.parentNode.style.width = '850px';


    }).catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading Chart',
                message: error.message,
                variant: 'error',
            })
        );
    });
    
}

showChart2(){
    // if (this.chart2Initialized) {
    //     return;
    //   }
    // this.chart2Initialized = true;
    console.log('Chart initialized ' + this.chart2Initialized)
    Promise.all([
        loadScript(this, chartjs)
    ]).then(() => {
      console.log('tttt',)
        //const ctx = this.template.querySelector('canvas.stacked2').getContext('2d');
       const ctx =  this.template.querySelector('canvas.stacked2').getContext('2d');
        console.log('ctx ' + ctx)
        console.log('hiii',JSON.parse(JSON.stringify(this.datalist)).filter(x => x.type == 'Sick Leave')[0]);
      this.chart2 =  new window.Chart(ctx, JSON.parse(JSON.stringify(this.datalist)).filter(x => x.type == 'Sick Leave')[0].config);
        this.chart2.canvas.parentNode.style.height = '319px';
            this.chart2.canvas.parentNode.style.width = '850px';


    }).catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading Chart',
                message: error.message,
                variant: 'error',
            })
        );
    });
    
}

showChart3(){
    // if (this.chart3Initialized) {
    //     return;
    //   }
    // this.chart3Initialized = true;
    console.log('Chart initialized ' + this.chart3Initialized)
    Promise.all([
        loadScript(this, chartjs)
    ]).then(() => {
        const ctx =  this.template.querySelector('canvas.stacked3').getContext('2d');
        console.log('ctx ' + ctx)
      this.chart3 =  new window.Chart(ctx, JSON.parse(JSON.stringify(this.datalist)).filter(x => x.type == 'Unpaid Leave')[0].config);
        this.chart3.canvas.parentNode.style.height = '319px';
            this.chart3.canvas.parentNode.style.width = '850px';


    }).catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading Chart',
                message: error.message,
                variant: 'error',
            })
        );
    });
    
}

renderedCallback(){
  console.log('renderedcallback');
}
  
}