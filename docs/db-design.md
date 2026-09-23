* user 

- name [string, required, minlength:3, maxlength:20,trim]
- email [string, require, unique, lowercase, trim]
- password [string, required,minlegnth:6]
- provider [string] enum:['system','google','instgram']
- profilePicture: [string] URL
- is verified[Boolean] default:false
- createdAt [date]
- updateAt [date]
- isDeleted [Boolean] default:false



* Message

- content [string, required, minlength:1, maxlength:200]
- receiver [objectId, required, ref:user]
- sender [objectId, ref:user]
- isDeleted [Boolean] default:false 
- createdAt [date]
- updatedAt [date]




* OTP 

- value [string, required, length:6]
- email [string, required]
- expireAt [date]
- createdAt [date]
- updatedAt [date]
