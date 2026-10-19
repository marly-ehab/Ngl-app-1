import { AppError } from "../../common/error/error.js";

export const userNotExist = () => new AppError("User Not Exist", 404);
export const userAlreadyExist = () => new AppError("User Already Exist", 409);
export const userNotVerified = () => new AppError("User Not Verified", 400);
export const userAlreadyVerified = () => new AppError("User Already Verified", 403);



//class User {
  //  UserName;
    //email;
    //password;


//    constructor(username, email, password, age) {
  //      this.UserName = username;
    //    this.email = email;
      //  this.password = password;
 //   }

//}

//class Customer extends User{
//    Phone;
//    age;
  //  address;
   // isVerified= false;
    //isDeleted;

    //constructor(phone,age, address, userName,password) {
      //  super(phone, age, address, userName, password);
        //this.Phone = phone;
        //this.age = age;
        //this.address = address;
        //this.isVerified = false;
        //this.isDeleted = false;
   // }
//}

//const customer1 = new Customer('01267398455', 21, 'alexandria');
//const customer2 = new Customer('01267398456', 21, 'cairo');

