express = require('express');

app = express();
app.use(express.static(__dirname + '/public'));

port = process.env.PORT || 5000

app.listen(port, function(){
    console.log('Listening on ' + port);
});