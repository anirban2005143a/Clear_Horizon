const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{ // return statement important or elese it won't return func and therefor error while running
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))
    }

}

export {asyncHandler}