import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function CalcButton(props) {
  return (
    <button className="calcButton" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


//Buttons component
class Buttons extends React.Component {

  //function for number buttons:
  numClickHandler = (buttonVal) => {
    
    const val = buttonVal.toString();
    let newState = {sign: this.props.sign}

    //just numbers under 16 characters long
    if (this.props.num.toString().length < 16) {
     
      //no number should start with zeros
      newState.num = this.props.num === 0 && val === "0"
      ? "0"
      : this.props.num % 1 === 0
      ? Number(this.props.num + val)
      //we add the new number to the current number
      : this.props.num + val;

      
      //if there is no sign, the result will remain 0
      newState.res =!this.props.sign ? 0 : this.props.res;

      newState.lastNum = !this.props.sign ? 0 : this.props.lastNum

      //we update the state of the calculator with our new result and current number values
      this.props.handleToUpdateState(newState)
    }
  };

  //function for decimal point button
  decimalHandler = (buttonVal) => {
    
    const val = buttonVal;
    let newState = {res:this.props.res, sign: this.props.sign, lastNum: this.props.lastNum}

    //if there is already a decimal point, another wont be added
    newState.num = !this.props.num.toString().includes(".") ? this.props.num + val : this.props.num;

    this.props.handleToUpdateState(newState)
  };

  //function for +,-,/,* buttons
  signClickHandler = (buttonVal) => {
    const val = buttonVal;

    let newState = {}

    newState.sign = val
    // it there is not already a result and there is a current number the result will be that current num otherwise will reamin res
    newState.res=!this.props.res && this.props.num ? this.props.num : this.props.res;

    //we saved the first operand so we can display the current operation down the main screen
    newState.lastNum = this.props.num === 0 && this.props.sign === '' ? this.props.res :this.props.num

    //we reset the current number, bc this will be the first operand
    newState.num = 0
  
    console.log(newState)
    this.props.handleToUpdateState(newState)
  };

  //function for '=' button
  equalsClickHandler = () => {
    let newState = {}
    if (this.props.sign && this.props.num) {

      //auxiliar function to determine the result depending on the binary sign
      const operation = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "x"
          ? a * b
          : sign === "%"
          ? a % b
          : a / b;

      //no divison by zero allowed, display error message on screen
      newState.res = this.props.num === "0" && this.props.sign === "/"
          ? "No divison by 0"
          : operation(Number(this.props.res), Number(this.props.num), this.props.sign);
      
      //we reset the sign and current num as the operation was perform
      newState.sign = ""
      newState.num=0
      newState.lastNum = newState.res

      console.log(newState)
      this.props.handleToUpdateState(newState)
    }
  };

  //function for performing operations with negative numbers
  invertNumClickHandler = () => {
    let newState = {lastNum: this.props.lastNum}

    //we change the sign of the values by multiplying them by *-1
    newState.num = this.props.num ? this.props.num * -1 : 0;
    newState.res = this.props.res ? this.props.res * -1 : 0;

    newState.sign = ""

    this.props.handleToUpdateState(newState)
  }

  //function for reseting calculator states
  resetClickHandler = () => {
    let newState = {}
    this.props.handleToUpdateState({
      num: 0,
      res: 0,
      sign: "",
      lastNum: 0,
    })
  }

  //function for erasing last digit
  deleteClickHandler = () => {
    let newState = {sign: this.props.sign, res:this.props.res, lastNum:this.props.lastNum, num: this.props.num}

    //if the current number is differente from zero we can delete the las elements, if the number only has 1, it will become 0
    if(this.props.num != 0){
      if(this.props.num.toString().length === 1){
        newState.num = 0;
      }else{
        newState.num = this.props.num.toString().substring(0, this.props.num.toString().length - 1);
      }
    //if the current number iis 0 that means we have to delete the last digit from the current result
    }else{
      newState.res = this.props.res.toString().substring(0, this.props.res.toString().length - 1);
      newState.lastNum = newState.res
    }

    this.props.handleToUpdateState(newState)
  }

  //function for creating and assing function to buttons
  renderCalcButtonFunc(i, func) {
    return (
      <CalcButton
        value={i}
        onClick={() => func(i)}
      />
    );
  }

  render() {
    return (
      <div className="buttons">
        <div className="board-row">
          {this.renderCalcButtonFunc('c', this.resetClickHandler)}
          {this.renderCalcButtonFunc('+-', this.invertNumClickHandler)}
          {this.renderCalcButtonFunc('%', this.signClickHandler)}
          {this.renderCalcButtonFunc('/', this.signClickHandler)}
        </div>
        <div className="board-row">
          {this.renderCalcButtonFunc(7, this.numClickHandler)}
          {this.renderCalcButtonFunc(8, this.numClickHandler)}
          {this.renderCalcButtonFunc(9, this.numClickHandler)}
          {this.renderCalcButtonFunc('x', this.signClickHandler)}
        </div>
        <div className="board-row">
          {this.renderCalcButtonFunc(4, this.numClickHandler)}
          {this.renderCalcButtonFunc(5, this.numClickHandler)}
          {this.renderCalcButtonFunc(6, this.numClickHandler)}
          {this.renderCalcButtonFunc('-', this.signClickHandler)}
        </div>
        <div className="board-row">
          {this.renderCalcButtonFunc(1, this.numClickHandler)}
          {this.renderCalcButtonFunc(2, this.numClickHandler)}
          {this.renderCalcButtonFunc(3, this.numClickHandler)}
          {this.renderCalcButtonFunc('+', this.signClickHandler)}
        </div>
        <div className="board-row">
          {this.renderCalcButtonFunc(0, this.numClickHandler)}
          {this.renderCalcButtonFunc('.', this.decimalHandler)}
          {this.renderCalcButtonFunc('=', this.equalsClickHandler)}
          {this.renderCalcButtonFunc('Back', this.deleteClickHandler)}
        </div>
      </div>
    );
  }
}



//Screen component
class Screen extends React.Component{

  render(){
    //if the operands are zero we do not rendered them on the little screen
    var secondOp = ''
    if(this.props.num != 0){secondOp = this.props.num};

    var firstOP = ''
    if(this.props.lastNum != 0){firstOP = this.props.lastNum};

    return (
      <div>
          <div className="screen" mode="single">
            {this.props.num ? this.props.num : this.props.res}
          </div>
          <div className="screen2" mode="single">
            {firstOP}{this.props.sign}{secondOp}
          </div>
      </div>
      
      
    );
  }
}


//the screen and buttons will be rendered by another component called calculator that will wrapped both of them
//Parent component of screen and buttons
class Calculator extends React.Component{
  constructor(props) {
    super(props);
    var handleToUpdateState = this.handleToUpdateState.bind(this);
   
    //states for calculator
    this.state ={
      sign: "",
      num: 0,
      res: 0,
      lastNum: null,
    }

  }

  //we pass the function setStates() so we can the state of the calculator shared by the screen and buttons
  handleToUpdateState(state){
    this.setState({sign:state.sign});
    this.setState({num:state.num});
    this.setState({res:state.res});
    this.setState({lastNum:state.lastNum});
  }

  render(){
    var handleToUpdateState = this.handleToUpdateState;
    
    return <div className="wrapper">
      <Screen 
      num={this.state.num}
      res={this.state.res}
      sign={this.state.sign}
      lastNum={this.state.lastNum}
      />
      <Buttons 
      num={this.state.num}
      res={this.state.res}
      sign={this.state.sign}
      lastNum={this.state.lastNum}
      handleToUpdateState = {handleToUpdateState.bind(this)}
      />
      </div>;
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);
