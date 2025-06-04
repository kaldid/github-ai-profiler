class AppError extends Error{
  constructor(
    statusCode, 
    message = "Something went wrong",
    errors = [],
    data = null,
    stack = "",
  ){
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode,
    this.data = data,
    this.message = message
    this.success = false
    this.errors = errors

    if (stack){
      this.stack = stack 
    } else{
      Error.captureStackTrace(this,this.constructor)
    }
  }
}

export default AppError
