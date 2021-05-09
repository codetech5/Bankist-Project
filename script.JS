'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2021-05-01T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-05-04T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-05-08T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-05-10T14:43:26.374Z',
    '2021-05-07T18:49:59.371Z',
    '2021-05-08T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Calculating no of days passed between two dates
const calcDaysPassed = function (d1, d2) {
  const diff = Math.abs(d1 - d2);//Type coercion will take place and d1 and d2 will be converted into timestamps that will be in milliseconds
  return Math.round(diff / (24 * 60 * 60 * 1000));
}


//DateDisplay functionality
const formatDisplayDate = function (date,locale) {

  const today = new Date();
  const daysPassed = calcDaysPassed(today,date);
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed === 0) return 'Today';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  
  //The below code will be executed only if the above statements are false because any of the above statement is true then it will return and below code will not execute
  // const day = `${date.getDate()}`.padStart(2, '0');
  // const month = `${date.getMonth()}`.padStart(2, '0');
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  //  Here we will not be providing option object because we don't want hours mins in the movementDates and so by default date/month/options will be displayed
  return new Intl.DateTimeFormat(locale).format(date);
}

//Make a function for formating the currency
const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(value);
}




// Function for displaying the withdraw and deposits...!

const displayMovements = function (acc,sort=false) {
    // Here you can also use textContent=""
    containerMovements.innerHTML = "";
    const movs = sort === true ? acc.movements.slice().sort() : acc.movements;
  movs.forEach(function (mov, i) {
 
           

    
      //Calling the formatDisplayDate method to format the date in particular way
      const date = new Date(acc.movementsDates[i]);
      const displayDate=formatDisplayDate(date,acc.locale);

        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const formattedMov=formatCurr(mov,acc.locale,acc.currency);
        const html = ` <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
        // insertAdjacentHTML accepts two arguments first argument where you want to add html element and then the second argument as string
        containerMovements.insertAdjacentHTML("afterbegin", html);
    })
    // There are differences between innerHTML and text content
    // InnerHTML returns all the html and the text
    // console.log(containerMovements.innerHTML);
    //textContent returns only the text not the html elements
    // console.log(containerMovements.textContent);
}

//Creating usernames for different accounts 
const createUsernames = function (accs) {
  // Here we used for each beacuse we don't want to create a new array
  accs.forEach(function (acc) {
    // Here we use map because we wanted to create a new storing the first character of each word
    acc.userName = acc.owner.toLowerCase().split(" ").map(function (name) {
      return name[0];
    }).join("");
  })
};
createUsernames(accounts);

// Difference between map and forEAch is that forEach creates side effects that means it do something without returning anything


//This update Ui function will update the UI if any transfer like deposit or withdrawal takes place...!
const updateUi = function (acc) {
  
  // Bank total balance display
  calcDisplayBalance(currentAccount);

  //DisplaySummary
  calcDisplaySummary(currentAccount);

  //Display Movements....!
  displayMovements(currentAccount);

}





//Function for timer and logging out the user
const startLogOutTimer = function () {
  //callback function for setinterval method
  const tick=function() {
    const mins = String(Math.trunc(time / 60)).padStart(2,0);
    const seconds = String(time % 60).padStart(2,0);
    labelTimer.textContent = `${mins}:${seconds}`;
    //Logging out the user
    if (time === 0)
    {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = "0";
    }

    time--;
  
  }
  
  //This represents the time in seconds and it means after this much seconds the user will log out
  let time = 240;

  //calling the tick function if we haven't called the function here then it will be running after 1 second as we passed in the settime Interval
  tick();

  //Adding timer functionality
  const timer=setInterval(tick, 1000); 
  return timer;
}





// Calculating total balance
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);
  // Creating a new property in acc object named as balance to store the total object
  acc.balance = balance;

  //Creating formatted balance using intl api according to different locale and different currency
  const formattedBalance = formatCurr(balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedBalance}`;
  
}





// displaying in,out and interest
const calcDisplaySummary = function (acc) {
// Here we are using mutliple chaining methods but in real world applications you should optimize your chaining method as much as you can for better performance like for eg if a particular task can be completed by one map then you should not use more than one map method
// One more imp point-----Don't use methods which mutuate the original array like reverse,splice in chaining because theywill reduce the perfomance of real world applications 
// Calculating the total deposits
  const incomes = acc.movements.filter(function (mov) {
    return mov > 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

// Calculating the total withdrawals
  const out = Math.abs(acc.movements.filter(function (mov) {
    return mov < 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0));

  //Formatting incomes and out
  const formattedIncomes = formatCurr(incomes, acc.locale, acc.currency);
  const formattedOut=formatCurr(out, acc.locale, acc.currency);

  labelSumIn.textContent =`${formattedIncomes}`;
  labelSumOut.textContent = `${formattedOut}`;
  
  const interest = acc.movements.filter(function (mov) {
    return mov > 0;
  }).map(function (deposit) {
    return deposit * acc.interestRate / 100;
  }).filter((int, i, arr) => {
    return int >= 1;
  }).reduce((acc, int) => acc + int, 0);

  const formattedInterest = formatCurr(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${formattedInterest}`;
}






// Login functionality
// When you apply addEventListener on an form element then automatically it will also work for the enter button
// It is created globally because it will be needed at various places
let currentAccount,timer;
btnLogin.addEventListener("click", function (event) {
  //This method preventDefault is used so that the button don't submits and refreshes the page  
  event.preventDefault();
  // Finding the account entered by the user in the accounts array
  currentAccount = accounts.find(function (acc) {
    return acc.userName === inputLoginUsername.value;
  });

  // Here we are using optional chaining so that if the username entered by the user is not present in the accounts array then pin will not be checked automatically the else condition will run 
  if (currentAccount?.pin === +inputLoginPin.value)
  {
    // Welcome Message
    labelWelcome.textContent = `Welcome back,${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = "100";



    //Creating Current date and time below current balance heading using internationalization API
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: 'numeric',
      day:"numeric",
      month:"numeric",
      year:"numeric",
      
    }
    labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    





    //This was the traditional method of creating date and time below current balalnce heading
    // const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, '0');
    // const month = `${now.getMonth()}`.padStart(2, '0');
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, '0');
    // const mins = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${date}/${month}/${year}, ${hours}:${mins}`;
    


    // Bank total balance display
    calcDisplayBalance(currentAccount);

    //DisplaySummary
    calcDisplaySummary(currentAccount);

    //Display Movements....!
    displayMovements(currentAccount);

    //Erasing the input field....!
    inputLoginPin.value = inputLoginUsername.value = "";
    // These method will remove focus from the element like remove the cursor from the pin input.This method is provided by the dom api 
    inputLoginPin.blur();
    // InputLoginPin.focus()----this method moves the focus to a particular element that means that the cursor will be on pin input
    
    //starting logouttimer
    if (timer) clearInterval(timer);
    timer=startLogOutTimer();



    //Transfer Functionality
    btnTransfer.addEventListener("click", function (event) {
      event.preventDefault();
      const amount = +inputTransferAmount.value;
      const receiverAcc= accounts.find(function (acc) {
        return acc.userName === inputTransferTo.value;
      });
      inputTransferAmount.value = inputTransferTo.value = "";
      // Checking different conditions for amount transfer....!
      if ( amount>=0 && receiverAcc && amount<=currentAccount.balance && receiverAcc?.userName!==currentAccount.userName)
      {
        //Pushing movement in movements array of the sender and reciever
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        //Pushing movementDates in movementDates array of the sender and reciever
        //We used Iso string here because in movementDates array the dates are present in the standard form 
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());
                
        
        // Calling the update UI function to change the UI 
        updateUi(currentAccount);
      }

      //Resetting Timer......!
      clearInterval(timer);
      timer = startLogOutTimer();
      
    })


    // Loan Request Functionality.....!
    btnLoan.addEventListener("click", function (event) {
      event.preventDefault();
      // Our bank has a rule that it will give a loan only if if there is any deposit in the movements array that is atleast 10percent of the requested loan
      //We need to round the value because we don't want to store or display decimal values
      const amount = Math.floor(inputLoanAmount.value);
      // This statement will return true or false....!
      const loanRequest = currentAccount.movements.some(function (curr) {
        return curr > 0 && curr >= amount / 10;
      })
      if (loanRequest && amount > 0) {
        //After some time consider 3 sec the loan should be approved so
        setTimeout(function () {
         
          //Pushing movement in movements array
          currentAccount.movements.push(amount);
          //Pushing movementDates in movementDatesArray
          currentAccount.movementsDates.push(new Date().toISOString());
          updateUi(currentAccount);


        },3000)
       
      }
      inputLoanAmount.value = "";

      //Resetting Timer
      clearInterval(timer);
      timer = startLogOutTimer();

    })

    
    // Deleting the account.....!
    btnClose.addEventListener("click", function (event) {
      event.preventDefault();
      // Once again checking the pin and username for deletion of the account...>!
      if (inputCloseUsername.value === currentAccount.userName && currentAccount.pin===+inputClosePin.value)
      {
        // FindIndex method works same as find method but the difference is that returns index of the element that satisfies the given condition....>!
        const deleteIndex=accounts.findIndex(function (acc) {
          return acc.userName === inputCloseUsername.value;
        })

        // Splice method mutuates the original array S
        accounts.splice(deleteIndex, 1);
        containerApp.style.opacity = "0";
      }
      inputCloseUsername.value = inputClosePin.value = "";

    })
    // Variable for maintaining the sorted state
    let sorted = false;
      //adding eventListener to the sort button
      btnSort.addEventListener("click", function () {
        displayMovements(currentAccount, !sorted);
        sorted = !sorted;
    })
  }
})



