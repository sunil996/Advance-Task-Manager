
const notFound=(req,res,next)=>{

    if (!res.headersSent) {
        res.status(404).send('This URL does not exist.');
      }
}

module.exports=notFound;  