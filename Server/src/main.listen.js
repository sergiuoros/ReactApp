/**
 * Created by SergiuOros on 11/12/16.
 */
module.exports =   function(app) {
  app.listen(8181, function() {
    const host = this.address().address;
    const port = this.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
  });
}