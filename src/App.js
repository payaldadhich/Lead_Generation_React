import React, { Component } from 'react';
import $ from 'jquery';
import { UncontrolledAlert } from 'reactstrap';

class App extends Component {
  constructor(){
    super();
    this.state = {
      step1:'activeFirst',
      activeStep:'display_none',
      genderArr:[],
      ageArr:[],
      questionArr:[],
      subArr:[],
      subThirdAnsArr:[],
      answersArr: {
        gender: '',
        age: '',
        question:'',
        mainAnswer:{
          answerFirst:'',
          answerFirstId:'',
          answerSecond:'',
          answerSecondId:'',
          answerThird:'',
          answerThirdId:'',
        },
      },
      doneAll:false,
      salesAns:[],
      name:'',
      phone:'',
      email:'',
      errorMessage:'',              
      errorMessageName:'',              
      errorMessageEmail:'',              
      errorMessagePhone:'',              
      errorMessageCount:0,
      errorMessageEmailCount:0,
      errorMessagePhoneCount:0,
      errorMessageNameCount:0,
    }
  }
  componentDidMount(){
    //integrate api for getting gender 
    fetch("http://192.168.2.123:8000/gender")
    .then(response=>response.json())
    .then(resp => {
        if(resp.status===200){
          this.setState({genderArr:resp.result});
        }
    });
  }
  handlePrevious(i){
    var step = i-1;
    if(this.state.answersArr.gender == 1 && i == 6 || this.state.doneAll && i == 6){
         step = 4;
    } 
    $("#nav"+i).removeClass('active');
    $("#step"+step).removeClass('display_none');
    $("#step"+i).addClass('display_none');
  }
  handleNext(i,type){
    var inc = i+1;
    if(this.state.answersArr.gender == 1 && i == 4 || this.state.doneAll && i == 4){
         inc = 6;
    } 
    $("#step"+i).addClass('display_none');
    $("#step"+inc).removeClass('display_none');
    if(type === 'age'){
      $(".age").addClass("active");
      this.handleAge(); 
    }else if(type === 'question'){
      $(".condition").addClass("active");
      this.handleQuestion(); 
    }else if(this.state.doneAll === true){
      $("#loading").addClass('display_none');
      $(".result").addClass("active");
      this.handleSubmit(); 
    }
  }
  handleQuestion(){
    fetch("http://192.168.2.123:8000/questions",{
      method:"post",
      headers:{
                "Content-Type":"application/json",
              },
      body:JSON.stringify({"genderid":this.state.answersArr.gender})
    })
    .then(response=>response.json())
    .then(resp=>{
      if(resp.status === 200){
        this.setState({questionArr:resp.result});
      }
    })
  }
  handleAge(){
    fetch("http://192.168.2.123:8000/age")
    .then(response=>response.json())
    .then(resp=>{
        if(resp.status === 200){
          this.setState({ageArr:resp.result});
        }
    });
  }
  handleClickGender(e){
    var answerState=this.state.answersArr;
    answerState.gender=e.target.value;
    this.setState({answersArr:answerState});
  }
  handleClickAge(e){
    var answerState=this.state.answersArr;
    answerState.age=e.target.value;
    this.setState({answersArr:answerState});
  }
  handler(e) {
    var res = e.target.id.split("_");
    if(res[1]==1)
    {
      var answerState=this.state.answersArr;
      answerState.question=$("#questionId").html();
      answerState.mainAnswer.answerFirst=e.target.value;
      answerState.mainAnswer.answerFirstId=e.target.id;
      var dataReason = JSON.parse(this.state.questionArr[0]['Answer'].answer);
      this.setState({answersArr:answerState,subArr:dataReason[res[0]].subAnswer});
    }if(res[1] == 2){
      var answerState=this.state.answersArr;
      answerState.mainAnswer.answerSecond=e.target.value;
      answerState.mainAnswer.answerSecondId=e.target.id;
      this.setState({
          answersArr:answerState,
          subThirdAnsArr:(this.state.subArr[res[0]].subAnswer)?this.state.subArr[res[0]].subAnswer:[],
          doneAll:(this.state.subArr[res[0]].subAnswer)?false:true
        });
    }if(res[1] == 3){
      var answerState=this.state.answersArr;
      answerState.mainAnswer.answerThird=e.target.value;
      answerState.mainAnswer.answerThirdId=e.target.id;
      this.setState({answersArr:answerState,doneAll:true});
    }
  }
  handleSubmit(){
    const answer = [{
                      "mainAnswer":this.state.answersArr.mainAnswer.answerFirst,
                      "subAnswer":[{
                        "mainAnswer":this.state.answersArr.mainAnswer.answerSecond,
                        "subAnswer":[{
                          "mainAnswer":this.state.answersArr.mainAnswer.answerThird
                        }]
                      }]
                    }];
    fetch("http://localhost:8000/addUser",{
      method: 'post',
      headers:{
              "Content-Type":"application/json",
            },
      body:JSON.stringify({
        "name":this.state.name,
        "email":this.state.email,
        "phone":this.state.phone,
        "plan":this.state.plan,
        "gender":(this.state.answersArr.gender == 2) ? 'Female':'Male',
        "age":this.state.answersArr.age,
        "question":this.state.answersArr.question,
        "answer":JSON.stringify(answer),
      })
    })
    .then(response => response.json())
    .then(resp => {
      console.log(resp);
      if(resp.status === 200){
        $("#loading").removeClass('display_none'); 
        $("#sales").addClass('display_none');
        JSON.parse(resp.result.answer).map((item,index)=>
          item.subAnswer.map((sitem,i)=>
            sitem.subAnswer.map((ssitem,i)=>{
              if(ssitem.mainAnswer == 'Queen Lifestyle Program -- the tools needed for a bikini body'){
                window.location.href = "https://www.okonfit.com/p/queen-lifestyle-sign-up";
              }else if(ssitem.mainAnswer === 'Queen Elite Program -- 12 week program that is customized and has the booty builder program build into it'){
                window.location.href = "https://www.okonfit.com/p/about-VIP-Transformation-program";
              }else if(ssitem.mainAnswer === 'Queen Lifestyle Program -- 6 week program to see results quickly over a several week period'){
                window.location.href = "https://www.okonfit.com/p/queen-lifestyle-sign-up";
              }else if(ssitem.mainAnswer === 'Queen Elite Program -- 12 week program that will help them gradually lose weight over the next few months, as well as help them understand the different elements in their health including: sleep, hormones, nutrition'){
                window.location.href = "https://www.okonfit.com/store/2HN84xSg";
              }else if(ssitem.mainAnswer === 'VIP Program - 6 month program'){
                window.location.href = "https://www.okonfit.com/p/about-VIP-Transformation-program";
              }else{
                $("#sales").removeClass('display_none'),
                $("#loading").addClass('display_none'),
                this.setState({salesAns:resp.result})
              }
            })
          )
        )
      }
    })
  }
  handleName(e){
      $("#name").removeClass("errors");
      this.setState({errorMessageName:" "});
      var nameReg = /^[a-zA-Z ]+$/;
      if(!nameReg.test(e.target.value)){
         $("#name").addClass("errors");
        this.setState({errorMessageName:"Please enter valid name",errorMessageNameCount:1});
      }else{
        this.setState({errorMessageNameCount:0})
      }
      this.setState({name:e.target.value});
  }
  handlePhone(e){
    $("#phone").removeClass("errors");
    this.setState({errorMessagePhone:" "});
    var phoneReg = /^\d+$/;
    if(!phoneReg.test(e.target.value)){
      $("#phone").addClass("errors");
      this.setState({errorMessagePhone:"Please enter valid phone number",errorMessagePhoneCount:1});
    }else if(e.target.value.length < 7){
      $("#phone").addClass("errors");
      this.setState({errorMessagePhone:"Please enter valid phone number",errorMessagePhoneCount:1});
    }else if(e.target.value.length > 15){
      $("#phone").addClass("errors");
      this.setState({errorMessagePhone:"Please enter valid phone number",errorMessagePhoneCount:1});
    }else{
      this.setState({errorMessagePhoneCount:0})
    }
    this.setState({phone:e.target.value});
  }
  handleEmail(e){
    $("#email").removeClass("errors");
      this.setState({errorMessageEmail:" "});
      var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if(!emailReg.test(e.target.value)){
         $("#email").addClass("errors");
        this.setState({errorMessageEmail:"Please enter valid email",errorMessageEmailCount:1});
      }else{
        this.setState({errorMessageEmailCount:0});
      }
    this.setState({email:e.target.value});
  }
  render() {
    let genderArr,ageArr,questionArr,subAnsArr,subThirdAnsArr,salesAnsPara = '';

    if(this.state.genderArr.length){
        genderArr = this.state.genderArr.map((item,index)=>
          <div key={index} className="custom-radio-btn">
            <div className={(this.state.answersArr.gender == item.id) ? 'gander-radio-btn active':'gander-radio-btn'}>
              <img src={"./"+item.image}/>
                <input type="radio" id={item.id} name="gender" onClick={this.handleClickGender.bind(this)} value={item.id} />
              <div htmlFor={item.id} className="gander-name">{item.gender}</div>
            </div>
          </div>
        );
    }
    if(this.state.ageArr.length){
      ageArr = this.state.ageArr.map((item,index)=>
        <div key={index} className="age-radio-btn-wrap col-sm-6">
          <div className={(this.state.answersArr.age == item.id)?"age-radio-btn active":"age-radio-btn"}>
            <input type="radio" name="age" onClick={this.handleClickAge.bind(this)} value={item.id} id={item.id} />
            <div htmlFor={item.id} className="radio-label">{item.age}</div>
          </div>
        </div>
      )
    }
    if(this.state.questionArr.length){
      questionArr = this.state.questionArr.map((item,index)=>
        <div key={index}>
          <h3 id="questionId">{item.question}</h3>
          <div className="flex-wrap clearfix">
            <Subanswer 
              sendVal={item.Answer.answer} 
              stateval={this.state.answersArr.mainAnswer.answerFirst} 
              handler = {this.handler.bind(this)}
            />
          </div>
        </div>
      )
    }
    if(this.state.subArr.length){
      subAnsArr = this.state.subArr.map((item,index)=>
        <div key={index} className={(this.state.answersArr.mainAnswer.answerSecond == item.mainAnswer)?"qus-ans-block subans-width active":"qus-ans-block subans-width"}>
          {(this.state.answersArr.mainAnswer.answerSecond == item.mainAnswer)?
            (<input type="radio" value={item.mainAnswer} checked id={index+"_2"} name="subanswer" onClick={this.handler.bind(this)} />):
            (<input type="radio" value={item.mainAnswer} id={index+"_2"} name="subanswer" onClick={this.handler.bind(this)} />)
          }
         <label htmlFor={index+"_2"} className="radio-inline">{item.mainAnswer}</label> 
        </div> 
      )
    }
    if(this.state.subThirdAnsArr.length){
      subThirdAnsArr = this.state.subThirdAnsArr.map((item,index)=>
        <div key={index} className={(this.state.answersArr.mainAnswer.answerThird == item.mainAnswer)?"qus-ans-block subans-width active":"qus-ans-block subans-width"}>
          {(this.state.answersArr.mainAnswer.answerThird == item.mainAnswer)?
          (<input type="radio" value={item.mainAnswer} checked id={index+"_3"} name="subnewans" onClick={this.handler.bind(this)} />):
          (<input type="radio" value={item.mainAnswer} id={index+"_3"} name="subnewans" onClick={this.handler.bind(this)} />
          )}
          <label htmlFor={index+"_3"} className="radio-inline">{item.mainAnswer}</label>
        </div>                 
      )
    }
    return (
      <div className="margin-top-50">
      <div className="col-md-10 center-block no-padding gym-step-process-wrapper">
         <div className="gym-step-process">
            <ul className="breadcrumb">
               <li className="active" id="nav1"><a href="javascript:void(0);"><span>Gender</span></a></li>
               <li className="age" id="nav2"><a href="javascript:void(0);"><span>Age</span></a></li>
               <li className="condition" id="nav3"><a href="javascript:void(0);"><span>Condition</span></a></li>
               <li className="result" id="nav6"><a href="javascript:void(0);"><span>Result</span></a></li>
           </ul>
         </div>
         <div className="clearfix"></div>
         <div className="col-md-12 gym-step-detail boxed margin-bottom-20 padding-top-bottom-20">
            <div className="step-contain-wrapper">
              <div className="step-contain-gender text-center">
                <h4>Let Me Show You How To Build The Body You Want - Based On Where You Are Right Now... To Begin, Select:</h4>
                <div className="gender-box-text" id="step1">
                  <h3>ARE YOU A <strong>MAN</strong> OR A <strong>WOMAN</strong>?</h3>
                  <div className="form-group col-sm-12">
                    {genderArr}
                  </div>
                  <div className="form-group col-sm-12">
                    <div className="pull-right">
                      <button type="button" onClick={this.handleNext.bind(this,1,'age')} className="btn btn-custom" disabled={!this.state.answersArr.gender}>Next</button>
                    </div>
                  </div>
                </div>
                <div className={"age-box-text "+this.state.activeStep} id="step2">
                  <h3>What's Your Age Range?</h3>
                  <br/>
                  <div className="form-group col-sm-8 center-block clearfix">
                    {ageArr}
                  </div>
                  <div className="form-group col-sm-12">
                    <div className="pull-left">
                      <button type="button" onClick={this.handlePrevious.bind(this,2)} className="btn btn-custom">Previous</button>
                    </div>
                    <div className="pull-right">
                      <button type="button" onClick={this.handleNext.bind(this,2,'question')} className="btn btn-custom" disabled={!this.state.answersArr.age}>Next</button>
                    </div>
                  </div>
                </div>
                <div className={"question-box-text "+this.state.activeStep} id="step3">
                  {questionArr}
                  <div className="form-group col-sm-12">
                    <div className="pull-left">
                      <button type="button" onClick={this.handlePrevious.bind(this,3)} className="btn btn-custom">Previous</button>
                    </div>
                    <div className="pull-right">
                      <button type="button" onClick={this.handleNext.bind(this,3,'question')} className="btn btn-custom" disabled={!this.state.answersArr.mainAnswer.answerFirst}>Next</button>
                    </div>
                  </div>
                </div>
                <div className={"answer-box-text "+this.state.activeStep} id="step4">
                {
                  (this.state.answersArr.gender==1) ?
                  (<h3 id="questionText">I found the perfect program for you!</h3>)
                :
                  (<h3 id="questionText">{(this.state.subThirdAnsArr)?this.state.answersArr.question:'I found the perfect program for you!'}</h3>)
                }
                  <div className="flex-wrap clearfix">
                    {subAnsArr}
                  </div>
                  <div className="form-group col-sm-12">
                    <div className="pull-left">
                      <button type="button" onClick={this.handlePrevious.bind(this,4)} className="btn btn-custom">Previous</button>
                    </div>
                    <div className="pull-right">
                      <button type="button" onClick={this.handleNext.bind(this,4,'handler')} className="btn btn-custom" disabled={!this.state.answersArr.mainAnswer.answerSecond}>Next</button>
                    </div>
                  </div>
                </div>
                <div className={"answer-box-text "+this.state.activeStep} id="step5">
                  <h3>I found the perfect program for you!</h3>
                  <div className="flex-wrap clearfix">
                    {subThirdAnsArr}
                  </div>
                  <div className="form-group col-sm-12">
                    <div className="pull-left">
                      <button type="button" onClick={this.handlePrevious.bind(this,5)} className="btn btn-custom">Previous</button>
                    </div>
                    <div className="pull-right">
                      <button type="button" onClick={this.handleNext.bind(this,5)} className="btn btn-custom" disabled={!this.state.answersArr.mainAnswer.answerThird}>Next</button>
                    </div>
                  </div>
                </div>
                <div className={"sales-box-text "+this.state.activeStep} id="step6">
                  <div className="result-from-design">
                    <div className="row" id="loading">
                      <img src="./HelpResource.jpeg" className="loadimg" alt=""/>
                    </div>
                    <div className="row" id="sales">
                      <span>We required redirect link for this section</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
    );
  }
}
class Subanswer extends Component{
  render() {
    var dataReason = JSON.parse(this.props.sendVal);
    var firstAnswers = dataReason.map((item,index)=>
        <div key={index} className={(this.props.stateval == item.mainAnswer) ? "qus-ans-block active": "qus-ans-block"}>
        <div className="inner-qus-ans-block">
          {
            (this.props.stateval == item.mainAnswer) ? 
            (<input type="radio" checked value={item.mainAnswer} id={index+"_1"} name="mainanswer" onClick = {this.props.handler}/>):
            (<input type="radio" value={item.mainAnswer} id={index+"_1"} name="mainanswer" onClick = {this.props.handler}/>)
          }
        <label htmlFor={index+"_1"} className="radio-inline">{item.mainAnswer}</label>
        </div>
        </div>
        
      )
    return firstAnswers;
   
  }
}
export default App;
